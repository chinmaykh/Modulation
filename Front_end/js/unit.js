var app = angular.module('modulesApp', [])

const urlParams = new URLSearchParams(window.location.search)
console.log(urlParams.get('name'))
var live_module = urlParams.get('name')


// Unit
class Unit {
  constructor(unitHead = String, unitContent = String, lastUpdated = Date, creationDate = Date, subUnits = Array, parents = Array) {
    this.head = unitHead,
      this.lastUpdated = lastUpdated,
      this.creationDate = creationDate,
      this.subUnits = subUnits
    this.parents = parents
    this.content = unitContent
  }
}


app.controller('ModuleController', function ($scope, $http) {
  console.log('Module controller loaded')

  $http({
    'method': 'GET',
    'url': 'http://localhost:8080/api/get/unit/param',
    'params': { head: live_module }
  }).then((response) => {
    if([].toString() == response.data.toString()){
      $scope.unit = {
        'head':'Oops! That doesn\'t exist',
        'lastUpdated':new Date,
        'creationDate':new Date
      }
      document.getElementById('unit-content').innerHTML = 'You can create it! Head over to Unit creation'
    } else{
      writePage(response.data[0])
    }
    

  })

  // Page writing script
  function writePage(unit) {


    $scope.unit = unit

    $scope.unit.lastUpdated = new Date($scope.unit.lastUpdated).toLocaleString('default', { month: 'long' }) + " " + new Date($scope.unit.lastUpdated).getDate() + " " + new Date($scope.unit.lastUpdated).getFullYear()
    $scope.unit.creationDate = new Date($scope.unit.creationDate).toLocaleString('default', { month: 'long' }) + " " + new Date($scope.unit.creationDate).getDate()

    console.log($scope.unit)

    unit.subUnit.forEach((element) => {
      $http({
        'method': 'GET',
        'url': 'http://localhost:8080/api/get/unit',
        'params': { _id: element }
      }).then((response) => {
        console.log(response.data)
        $scope.unit.subUnit[unit.subUnit.indexOf(element)] = response.data[0]
      }, (error) => {
        console.error(error)
      })
    });

    document.getElementById('unit-content').innerHTML = $scope.unit.content
    

    var tooltipelems = document.querySelectorAll('.tooltipped');
    var tooltipinstances = M.Tooltip.init(tooltipelems, {});

  }

});


app.controller('UnitCreationController', ($scope, $http) => {
  console.log('Unit Creation controller loaded')

  // Get units

  $scope.subUnits = []
  justIds = []
  justHeads = []

  $http({
    'method': "GET",
    'url': 'http://localhost:8080/api/get/unit/param',
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

  $scope.s_units = []


  // Creation unit
  $scope.createUnit = () => {
    reqIds = []
    $scope.s_units.forEach((element) => {
      reqIds.push(justIds[justHeads.indexOf(element)])
    })

    var newUnit = new Unit($scope.unitHead, $scope.unitContent, new Date(), new Date(), reqIds, JSON.parse(sessionStorage.getItem('appearsIn')))
    console.log('Unit')
    console.log(newUnit)

    $http({
      'method': 'POST',
      'url': 'http://localhost:8080/api/create/unit',
      'data': newUnit
    }).then((response) => {
      console.log(response.data)
      sessionStorage.clear()
      document.location.reload()
    })

  }

})
