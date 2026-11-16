# 发布前端：先构建，再上传 Cloudflare Pages，成功后再把 IPFS 包提交到 IPFS。
# IPFS 只提交、不 pin。本地网关地址形如 http://127.0.0.1:8080/ipfs/<cid>/
# 用法（PowerShell 7）：
#   pwsh -NoProfile -File .\scripts\deploy.ps1

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$IpfsApi = if ($env:IPFS_API) { $env:IPFS_API } else { '/ip4/192.168.0.14/tcp/5001' }
$Gateway = if ($env:IPFS_GATEWAY) { $env:IPFS_GATEWAY.TrimEnd('/') } else { 'http://127.0.0.1:8080' }

Write-Host '构建生产包...'
pnpm build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '上传 Cloudflare Pages...'
wrangler pages deploy dist --project-name=qkiscan
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '构建 IPFS 包（相对路径 + hash 路由）...'
$env:VITE_APP_IPFS = 'true'
pnpm exec vite build --outDir dist-ipfs
$viteExit = $LASTEXITCODE
Remove-Item Env:VITE_APP_IPFS -ErrorAction SilentlyContinue
if ($viteExit -ne 0) { exit $viteExit }

Write-Host "Pages 已上传，提交 dist-ipfs 到 IPFS（$IpfsApi），不 pin..."
$cidLines = @(ipfs --api $IpfsApi add -r -Q --pin=false --cid-version=1 .\dist-ipfs)
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$cid = "$($cidLines | Select-Object -Last 1)".Trim()
if (-not $cid) {
  Write-Error 'IPFS 提交失败：没有返回 CID'
}

$cidFile = Join-Path $Root 'dapp.cid'
$gatewayUrl = "$Gateway/ipfs/$cid/"
@(
  $cid
  $gatewayUrl
) | Set-Content -Path $cidFile -Encoding utf8NoBOM
Write-Host "IPFS CID: $cid"
Write-Host "本地网关: $gatewayUrl"
Write-Host "已写入本地文件: $cidFile"
Write-Host '生产站点: https://qkiscan.io'
