$(function() {
    // Example 1
    $('#example-1 textarea').miniCount();

    //    Example 2
    $('input.letter').miniCount({
      min           : 5,
      unit          : 'letter',
      text          : '',
      invalidText   : 'letters (5 minimum)',
      hideOnValid   : true,
      countdown     : true
    });

    $('input.word').miniCount({
      max           : 5,
      unit          : 'word',
      text          : 'words left',
      invalidText   : 'words',
      countdown     : true
    });

    // Example 1
    $('#example-3 textarea').miniCount({
      min            : 2,
      max            : 5,
      unit           : 'sentence',
      text           : 'current count:',
      invalidText    : 'current count:',
      textPosition   : 'before',
      counterPosition: 'before'
    });
});
