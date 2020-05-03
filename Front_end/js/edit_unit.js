var app = angular.module('modulesApp', [])

const urlParams = new URLSearchParams(window.location.search)
console.log(urlParams.get('name'))
var live_module = urlParams.get('name')


// Unit
class Unit {
  constructor(eyeD, unitHead = String, unitContent = String, lastUpdated = Date, creationDate = Date, subUnits = Array, parents = Array) {
    this.head = unitHead,
      this.lastUpdated = lastUpdated,
      this.creationDate = creationDate,
      this.subUnit = subUnits
    this.parents = parents
    this.content = unitContent
    this._id = eyeD
  }
}

app.controller('UnitEditController', function ($scope, $http) {
  console.log('Unit Editing controller loaded')
  // 'Nature Of Stationary Points: Second Order Taylor'


  // First get the module over the net
  $http({
    'method': 'GET',
    'url': '/api/get/unit/param',
    'params': { head: live_module }
  }).then((response) => {
    console.log(response.data[0])
    if ([].toString() == response.data.toString()) {
      $scope.unit = {
        'head': 'Oops! That doesn\'t exist',
        'lastUpdated': new Date,
        'creationDate': new Date
      }
      document.getElementById('unit-content').innerHTML = 'You can create it! Head over to Unit creation'
    } else {
      writePage(response.data[0])

    }
  }, (error) => { console.log(JSON.stringify(error)) })

  updatedUnit = new Unit()

  // Page writing script
  function writePage(unit) {

    $scope.unit = new Unit(unit._id, unit.head, unit.content, unit.lastUpdated, unit.creationDate, [], unit.parents)
    updatedUnit = new Unit(unit._id, unit.head, unit.content, unit.lastUpdated, unit.creationDate, [], unit.parents)

    unit.subUnit.forEach((element) => {
      $http({
        'method': 'GET',
        'url': 'http://localhost:8080/api/get/unit',
        'params': { _id: element }
      }).then((response) => {
        $scope.unit.subUnit.push(response.data[0].head)
        updatedUnit.subUnit.push(response.data[0].head)
      }, (error) => {
        console.error(error)
      })
    });


    document.getElementById('unit-content').innerHTML = $scope.unit.content
    MathJax.typeset()

    var tooltipelems = document.querySelectorAll('.tooltipped');
    var tooltipinstances = M.Tooltip.init(tooltipelems, {});
    M.textareaAutoResize(document.getElementById('textarea1'))

  }

  // Movaable list
  var el = document.getElementById('items');
  var sortable = Sortable.create(el, {
    swap: true, // Enable swap plugin
    swapClass: 'highlight', // The class applied to the hovered swap item
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: (evt) => {
      console.log("Reordered")
      //Swapping in the updated array
      console.log('Went from' + (evt.oldIndex) + 'to' + (evt.newIndex))
      let x = updatedUnit.subUnit[evt.newIndex]
      updatedUnit.subUnit[evt.newIndex] = updatedUnit.subUnit[evt.oldIndex]
      updatedUnit.subUnit[evt.oldIndex] = x
      console.log(updatedUnit.subUnit)
    }
  });

  // Rerendering the html to incorporate changes
  $scope.rerender = function () {
    updatedUnit.content = $scope.unit.content
    document.getElementById('unit-content').innerHTML = $scope.unit.content
    var tooltipelems = document.querySelectorAll('.tooltipped');
    var tooltipinstances = M.Tooltip.init(tooltipelems, {});
    MathJax.typeset()
  }



  $scope.addSubUnit = function (unitHead) {
    if (updatedUnit.subUnit.indexOf(unitHead) == -1 && unitHead != live_module) {
      console.log(unitHead)
      updatedUnit.subUnit.push(unitHead)
      $scope.unit.subUnit.push(unitHead)
    }

  }

  $scope.deleteThis = function (index) {
    console.log(index)
    updatedUnit.subUnit.splice(updatedUnit.subUnit.indexOf($scope.unit.subUnit[index]), 1)
    $scope.unit.subUnit.splice(index, 1)
    console.log($scope.unit.subUnit)
  }


  // Subunits for selection
  $scope.subUnits = []
  justIds = []
  justHeads = []

  // Getting the subunits list
  $http({
    'method': "GET",
    'url': '/api/get/unit/param',
    'params': {}
  }).then((response) => {
    console.log(response.data)
    response.data.forEach((element) => {
      $scope.subUnits.push({
        'head': element.head,
      })
      justHeads.push(element.head)
      justIds.push(element._id)
    })
  })

  // Save the update
  $scope.update = function () {
    // content, name, _id, cd, ld, parents, subunits
    updatedUnit.lastUpdated = new Date()
    console.log('Saving to server')
    console.log(updatedUnit)

    namesArray = updatedUnit.subUnit

    updatedUnit.subUnit.forEach((element) => {

      $http({
        'method': 'GET',
        'url': '/api/get/unit/param',
        'params': { head: element }
      }).then((response) => {
        console.log(element)
        updatedUnit.subUnit[updatedUnit.subUnit.indexOf(element)] = response.data[0]._id

        if (updatedUnit.subUnit.length == (updatedUnit.subUnit.indexOf(response.data[0]._id) + 1)) {

          $http({
            'method': 'PUT',
            'url': '/api/update/unit',
            'data': updatedUnit
          }).then((response) => {
            console.log(response.data)
          })
        }

      }, (error) => { console.log(JSON.stringify(error)) })
    })


  }

});