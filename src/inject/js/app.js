import dataUtil from './util/dataUtil';
import sidebarUtil from './util/sidebarUtil';
import util from './util/globalUtil';

chrome.extension.sendMessage({}, (response) => {
    var sideBarContainer;

    function _init(){
        var urlParams = util.getUrlVars();
        var visibleFlags = dataUtil.getVisibleFlags();
        
        
        //empty if needed
        $('#side-bar-advanced-tool').remove();

        sideBarContainer = $('<div id="side-bar-advanced-tool" />')
            .appendTo('body')

        $('<h3 id="side-bar-title" />')
            .appendTo(sideBarContainer)
            .text('Github Improved Toolbox')

        var searchBarContainer = $('<form id="side-bar-form-search" />')
            .appendTo(sideBarContainer)
            .on('submit', sidebarUtil.onSearchRepo)
            .toggle(visibleFlags.searchFile);

        var cmdContainer = $('<div id="side-bar-cmd-palette" />')
            .appendTo(sideBarContainer);



        //whitespace diff
        $('<button id="cmd-search-file" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('Search File')
            .on('click', sidebarUtil.onGoToGetSearchUrl)
            .toggle(visibleFlags.searchFile)

        $('<button id="cmd-diff-whitespace-option" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text(urlParams.w !== '1' ? 'Whitespace Diff' : 'Non-Whitespace Diff')
            .on('click', urlParams.w !== '1' ? sidebarUtil.onGoToDiffNonWhitespaceUrl : sidebarUtil.onGoTogetDiffWithWhitespaceUrl)
            .toggle(visibleFlags.differ)


        $('<button id="cmd-diff-type" class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text(urlParams.diff !== 'split' ? 'Split Diff' : 'Unified Diff')
            .on('click', urlParams.diff !== 'split' ? sidebarUtil.onGoToSplitDiffUrl : sidebarUtil.onGoToUnifieDiffUrl)
            .toggle(visibleFlags.differ)


        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR created by you')
            .on('click', sidebarUtil.onGoToOwnPRUrl);


        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR assigned to you')
            .on('click', sidebarUtil.onGoToAssignedPRUrl)
                

        $('<button class="btn btn-sm" />')
            .appendTo(cmdContainer)
            .text('PR mentioning you')
            .on('click', sidebarUtil.onGoToMentioningYouPRUrl)


        //search
        $('<input class="form-control" placeholder="Keyword" name="keyword" />')
            .appendTo(searchBarContainer)
        var searchOption = $('<select class="form-control" name="type" />')
            .appendTo(searchBarContainer)
            .append($('<option value="file" />').text('File Content'))
            .append($('<option value="path" />').text('Path Name'))
            .append($('<option value="file,path" />').text('File and Content'))


        $('<input class="form-control" placeholder="Language" name="language" list="search-language" />')
            .appendTo(searchBarContainer)

        // $('<input class="form-control" placeholder="Author" name="author" />')
        //     .appendTo(searchBarContainer)

        //auto comeplete
        var dataListSearchLanguages = $('<datalist id="search-language" />')
            .appendTo(searchBarContainer);
        dataUtil.getSupportedLanguages().map( (language) => {
            $('<option />').attr('value', language).appendTo(dataListSearchLanguages)
        });


        $('<button class="btn btn-sm" type="submit" />')
            .appendTo(searchBarContainer)
            .text('Search')
    }

    function _eventLoopHandler(){
        var urlParams = util.getUrlVars();
        var visibleFlags = dataUtil.getVisibleFlags();

        sideBarContainer
            .find('#cmd-search-file')
            .off('click')
            .toggle(visibleFlags.searchFile)

        sideBarContainer
            .find('#cmd-diff-whitespace-option')
            .off('click')
            .text(urlParams.w !== '1' ? 'Whitespace Diff' : 'Non-Whitespace Diff')
            .on('click', urlParams.w !== '1' ? sidebarUtil.onGoToDiffNonWhitespaceUrl : sidebarUtil.onGoTogetDiffWithWhitespaceUrl)
            .toggle(visibleFlags.differ)

        sideBarContainer
            .find('#cmd-diff-type')
            .off('click')
            .text(urlParams.diff !== 'split' ? 'Split Diff' : 'Unified Diff')
            .on('click', urlParams.diff !== 'split' ? sidebarUtil.onGoToSplitDiffUrl : sidebarUtil.onGoToUnifieDiffUrl)
            .toggle(visibleFlags.differ)

        sideBarContainer
            .find('#side-bar-form-search')
            .toggle(visibleFlags.searchFile)
    }

    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            _init();

            setInterval(_eventLoopHandler, 3000);
        }
    }, 10);
});