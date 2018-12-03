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
    <title data-n-head="true">区块浏览器 | QKI</title>
    <link data-n-head="true" rel="icon" type="image/x-icon" href="">

    <link data-n-head="true" rel="stylesheet" type="text/css" charset="utf-8" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/app.css?v={{time()}}">
    <link rel="stylesheet" href="/css/jquery-confirm.css" />
    <link rel="stylesheet" href="/fonts/iconfont.css" />
    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery-confirm.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="https://cdn.ravenjs.com/3.26.4/raven.min.js" crossorigin="anonymous"></script>
    <script type="text/javascript">
        Raven.config('https://c1b1a9e60a2c43f6bc8e237d046d8433@sentry.quarkblockchain.cn/3').install();
    </script>

</head>

<body>
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
                        <a href="/tx-list">交易</a>
                    </li>
                    <li class="nuxt-link-exact-active nuxt-link-active nav-item @if(isset($currentPage) && $currentPage=='unpacked-tx-list') current @endif">
                        <a href="/unpacked-tx-list">未打包交易</a>
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


            <div id="nav_menu" class="navbar-collapse collapse" style="display: none;"><div class="menu-container">
                    <ul class="navbar-nav nav-links">
                        <li class="nav-item current">
                            <a href="/" class="nav-link">首页
                            </a>
                        </li>
                        <li class="nav-item">
                            <a rel="noopener" href="/block"  class="nav-link">区块</a>
                        </li>
                        <li class="nav-item">
                            <a rel="noopener" href="/tx-list"  class="nav-link">交易</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


        @yield('content')


        <div class="vfooter">

            <p class="panel-bottom">Copyright ©2018 quarkblockchain v{{config('app.version')}}</p>
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
</body>

</html>