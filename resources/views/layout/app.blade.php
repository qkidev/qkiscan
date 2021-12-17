<!DOCTYPE html>
<html data-n-head="">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta data-n-head="true" name="viewport" content="width=device-width, initial-scale=1">
    <meta data-n-head="true" renderer="webkit">
    <meta data-n-head="true" name="format-detection" content="telephone=no">
    <meta data-n-head="true" http-equiv="X-UA-Compatible" content="IE=edge">
    <meta data-n-head="true" data-hid="description" name="description" content="">
    <meta data-n-head="true" data-hid="keywords" name="keywords" content="">
    <title data-n-head="true">{{config('app.name')}} | QKI</title>
    <link data-n-head="true" rel="icon" type="image/x-icon" href="">
    <link rel="search" type="application/opensearchdescription+xml" href="/open-search-xml" title="QKI区块浏览器" />
    <link data-n-head="true" rel="stylesheet" type="text/css" charset="utf-8" href="{{env('ASSETS_HOST')}}/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{env('ASSETS_HOST')}}/css/style.css">
    <link rel="stylesheet" href="{{env('ASSETS_HOST')}}/css/app.css?v=2">
    <link rel="stylesheet" href="{{env('ASSETS_HOST')}}/css/jquery-confirm.css" />
    <link rel="stylesheet" href="{{env('ASSETS_HOST')}}/fonts/iconfont.css" />
    <script src="{{env('ASSETS_HOST')}}/js/jquery.min.js"></script>
    <script src="{{env('ASSETS_HOST')}}/js/jquery-confirm.min.js"></script>
    <script src="{{env('ASSETS_HOST')}}/js/bootstrap.min.js"></script>
    @if(env('SENTRY_DSN'))
    <script src="https://static.quarkblockchain.cn/lib/js/bundle.min.js"></script>
    <script>
        Sentry.init({ dsn: '{{env('SENTRY_DSN')}}'});
    </script>
    @endif
</head>

<body>
    <div>
        <div class="vheader">
            <div class="vcontainer vheader-inner">
                <a href="/" class="icon iconfont icon-icon-test1 news_logo"></a>
                <ul class="nav d-lg-block d-none">
                    <li class="nuxt-link-exact-active nuxt-link-active nav-item @if(isset($currentPage) && $currentPage=='index') current @endif">
                        <a href="/">首页</a>
                    </li>
                    <li class="nuxt-link-exact-active nuxt-link-active nav-item @if(isset($currentPage) && $currentPage=='block') current @endif">
                        <a href="/block">区块</a>
                    </li>
                    <li class="nuxt-link-exact-active nuxt-link-active nav-item @if(isset($currentPage) && $currentPage=='tx-list') current @endif">
                        <a href="/tx-list/1">Tx</a>
                    </li>
                    <li class="nuxt-link-exact-active nuxt-link-active nav-item @if(isset($currentPage) && $currentPage=='unpacked-tx-list') current @endif">
                        <a href="/unpacked-tx-list">未打包Tx</a>
                    </li>
                </ul>
                <div class="search-container d-lg-block d-none">
                    <div class="vsearch-panel" data-v-2f615f5c="">
                        <div class="vsearch" data-v-2f615f5c="">
                            <div class="vsearch-inner" data-v-2f615f5c="">
                                <div class="search-bar" data-v-2f615f5c="">
                                    <input placeholder="QKI地址、区块高度、Hash值" value="" class="input-search" id="pc-search-input" data-v-2f615f5c="">
                                    <i class="btn-search search-btn"  data-v-2f615f5c=""></i>
                                </div>
                            </div>
                        </div>
                        <div class="placeholder" data-v-2f615f5c=""></div>
                    </div>
                </div>
                <div class="mobile-menu d-block d-lg-none">
                    <button type="button" aria-label="Toggle navigation" aria-controls="nav_search" aria-expanded="false" id="button_nav_search" class="nav-toggle navbar-toggler">
                        <span class="icon-button icon-search"></span>
                    </button>
                    <button type="button" aria-label="Toggle navigation" aria-controls="nav_menu" aria-expanded="false" id="button_nav_menu" class="nav-toggle navbar-toggler">
                        <span class="icon-button icon-hamburger"></span>
                    </button>
                </div>
            </div>

            <div id="nav_search" class="navbar-collapse collapse" style="">
                <ul class="navbar-nav">
                    <div class="mobile-search-container">
                        <div class="vsearch-panel" data-v-2f615f5c="">
                            <div class="vsearch" data-v-2f615f5c="">
                                <div class="vsearch-inner" data-v-2f615f5c="">
                                    <div class="search-bar" data-v-2f615f5c="">
                                        <input placeholder="QKI地址、区块高度、Hash值" value="" class="input-search" id="web-search-input" data-v-2f615f5c=""><i class="btn-search search-btn" data-v-2f615f5c=""></i></div></div></div><div class="placeholder" data-v-2f615f5c="">
                            </div>
                        </div>
                    </div>
                </ul>
            </div>

            <div id="nav_menu" class="navbar-collapse collapse" style="display: none;"><div class="menu-container">
                    <ul class="navbar-nav nav-links">
                        <li class="nav-item @if(isset($currentPage) && $currentPage=='index') current @endif">
                            <a href="/" class="nav-link">首页
                            </a>
                        </li>
                        <li class="nav-item @if(isset($currentPage) && $currentPage=='block') current @endif">
                            <a rel="noopener" href="/block"  class="nav-link">区块</a>
                        </li>
                        <li class="nav-item @if(isset($currentPage) && $currentPage=='tx-list') current @endif">
                            <a rel="noopener" href="/tx-list/1"  class="nav-link">Tx</a>
                        </li>
                        <li class="nav-item @if(isset($currentPage) && $currentPage=='unpacked-tx-list') current @endif">
                            <a rel="noopener" href="/unpacked-tx-list"  class="nav-link">未打包Tx</a>
                        </li>
                        <li class="nav-item @if(isset($currentPage) && $currentPage=='qki-page') current @endif">
                            <a rel="noopener" href="/qki-page"  class="nav-link">富豪榜</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


        @yield('content')


        <div class="vfooter">
            <p class="panel-bottom">
                Copyright ©2018-2020 quarkblockchain <a href="/apis">api</a> <a href="/bp">bp</a> <a href="/tokens">tokens</a>  <a href="/node-statistics">node-statistics</a>

            </p>
            <p class="panel-bottom">
                @if(env('ICP_NUM'))
                    <a href="http://www.beian.miit.gov.cn" target="_blank">{{env('ICP_NUM')}}</a>
                @endif
                @if(env('DONATE_ADDRESS'))
                    捐赠地址: <a href="/address/{{env('DONATE_ADDRESS')}}">{{env('DONATE_ADDRESS')}}</a>
                @endif
            </p>

        </div>

        <div id="btn_top" class="cmp-navtop d-none d-lg-flex" style="display:none;" data-v-59831c6c="">
            <span class="arrow" data-v-59831c6c=""></span>
            <span class="text" data-v-59831c6c="">TOP</span>
        </div>
    </div>

    <script type="text/javascript">
        $('#btn_top').click(function () {
            $('html,body').animate({ scrollTop: 0 }, 500);
        });
        var show = true;
        $('#button_nav_search').bind('click',function(){
            if(!$("#nav_search").is(":animated")){
                if(show==true){

                    $("#nav_search").slideDown("slow");
                    show=false;
                }else if(show==false){

                    $("#nav_search").slideUp("slow");
                    show=true;
                }
            }
        })
        var show_nav = true;
        $('#button_nav_menu').bind('click',function(){
            if(!$("#nav_menu").is(":animated")){
                if(show_nav==true){

                    $("#nav_menu").slideDown("slow");
                    show_nav=false;
                }else if(show_nav==false){

                    $("#nav_menu").slideUp("slow");
                    show_nav=true;
                }
            }
        })

        $(".search-btn").click(function () {
            search();
        });

        $(".input-search").keypress(function(e) {
            // 回车键事件
            if(e.which == 13) {
                search();
            }
        });


        function search() {
            var keyword;
            if($('#pc-search-input').val() != '')
            {
                keyword = $('#pc-search-input').val();
            }else{
                keyword = $('#web-search-input').val();
            }
            if(!keyword){
                $.alert({
                    type: 'red',
                    title: '系统提示',
                    content: '请输入"QKI地址、区块高度、Hash值',
                });
                return false;
            }

            window.location.href = '/search?keyword='+keyword;
        }
    </script>
    @if(env('CNZZ_ID'))
        <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_{{env('CNZZ_ID')}}}'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s9.cnzz.com/z_stat.php%3Fid%3D{{env('CNZZ_ID')}}}%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));</script>
    @endif
</body>

</html>
