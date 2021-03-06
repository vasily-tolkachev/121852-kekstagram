'use strict';

var filtersContainer = document.querySelector('.filters');
var filterInputs = filtersContainer['filter'];
var DAYS_LIMIT = 4;

var compareCommentsNumber = function(a, b) {
  if (b.comments < a.comments) {
    return -1;
  }
  if (b.comments > a.comments) {
    return 1;
  }
  return 0;
};

var compareDate = function(a, b) {
  var firstDate = new Date(a.date);
  var secondDate = new Date(b.date);

  if (secondDate < firstDate) {
    return -1;
  }
  if (secondDate > firstDate) {
    return 1;
  }
  return 0;
};

var isPictureNew = function(picture) {
  //количество дней от даты публикации до текущего момента
  var daysAre = (Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000;
  return daysAre <= DAYS_LIMIT;
};

var filtersList = [
  {
    value: 'new',
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.sort(compareDate).filter(isPictureNew);
    }
  },
  {
    value: 'discussed',
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.sort(compareCommentsNumber);
    }
  },
  {
    value: 'popular',
    default: true,
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.filter(function() {
        return true;
      });
    }
  }
];

var defaultFilter = filtersList.filter(function(filter) {
  return filter.default;
})[0];

var getFilteredPictures = function(picturesToFilter, filterName) {
  var pictures = picturesToFilter.slice(0);
  filterName = filterName || defaultFilter.value;
  localStorage.setItem('filter', filterName);
  var currentFilter = filtersList.filter(function(filter) {
    return filter.value === filterName;
  })[0];

  [].filter.call(filterInputs, function(item) {
    if (item.value === filterName) {
      item.setAttribute('checked', 'checked');
    }
  });

  return currentFilter.filteringMethod(pictures);
};

module.exports = getFilteredPictures;
