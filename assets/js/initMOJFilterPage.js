window.MOJFrontend.initAll()
new MOJFrontend.FilterToggleButton({
  bigModeMediaQuery: '(min-width: 48.063em)',
  startHidden: true,
  toggleButton: {
    container: $('.moj-action-bar__filter'),
    showText: 'Show filter',
    hideText: 'Hide filter',
    classes: 'govuk-button--secondary toggle-filter-button',
    attributes: {
      'data-qa': 'toggle-filter-button',
    },
  },
  closeButton: {
    container: $('.moj-filter__header-action'),
    text: 'Close',
  },
  filter: {
    container: $('.moj-filter'),
  },
})

function moveFilterTagsToResults() {
  var newContainer = $('.moj-action-bar__filterTagsContainer')
  var tagsContainer = $('.moj-filter__selected')
  tagsContainer.appendTo(newContainer)
}

moveFilterTagsToResults()
