@if ($paginator->hasPages())
    <ul class="pagination" role="navigation">
        @if (!$paginator->onFirstPage())
            <li class="page-item" aria-disabled="true" aria-label="« Previous">
                <a class="page-link" href="{{ $paginator->previousPageUrl() }}" rel="previous" aria-label="« Previous">上一页</a>
            </li>
        @endif

        @if ($paginator->hasMorePages())
        <li class="page-item">
            <a class="page-link" href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="Next »">下一页</a>
        </li>
        @endif
    </ul>
@endif
