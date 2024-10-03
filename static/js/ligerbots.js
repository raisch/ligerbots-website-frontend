const elt = document.getElementById('ligerbots-js')
if (elt && elt.nonce) {
  console.log('saving nonce')
  sessionStorage.setItem('ligerbots-js-nonce', elt.nonce)
}

// function resizeRow (id1, id2) {
//   $(id2).css('height', $(id1).height())
// }

// function resizePanes () {
//   var width = window.innerWidth > 0 ? window.innerWidth : screen.width
//   if (width > 990) {
//     resizeRow('#blog-panel', '#cal-panel')
//     resizeRow('#ann-panel', '#twitter-widget-0')
//   }
// }

// $(window).on('load resize', resizePanes)
// $('#twitter-widget-0').on('load', resizePanes)
// setTimeout(function () {
//   resizePanes()
// }, 1000)
