module.exports = function visit(section) {
  var copy = section.slice(0)
  var name = copy.shift() // remove first el
  var rtrn = {}
  rtrn[name] = copy
  return parseMembers(rtrn)
}

function bool(s) {
  if (s === 'true') return true
  if (s === 'false') return false 
  return s
}

function parseMembers(rtrn) {
  
  var num = s=> isNaN(s)? s : +s
  var name = Object.keys(rtrn)[0]
  var members = rtrn[name]
  var finals = []
  var index = 0
  var lastObj = 0

  members.forEach(member=> {
    
    // this line has no spaces
    var isSingle = !/ /g.test(member)

    // maps start with no spaces and have indented tuple members
    var isMap = (function lookAhead(all) {
      var curIndex = all.indexOf(member)
      var nextMember = all[curIndex + 1]
      return isSingle && nextMember && nextMember.startsWith('  ')
    })(members)

    var isMapMember = member.startsWith('  ')

    var isVector = !isMapMember && !isSingle && Array.isArray(member.split(' '))

    if (isMap) {
      var anon = {}
      anon[member] = {}
      lastObj = index
      finals.push(anon)
      index += 1
    }
    else if (isMapMember) {
      var tupleMember = member.trim().split(' ').map(num).map(bool)
      var idx = lastObj
      var name = Object.keys(finals[idx])[0]
      var prop = tupleMember.shift()
      finals[idx][name][prop] = tupleMember.length === 1? tupleMember[0] : (tupleMember.length === 0? false : tupleMember)
    }
    else if (isVector) {
      finals.push(member.split(' ').map(num).map(bool))
      index += 1
    }
    else if (isSingle) {
      finals.push(isNaN(member)? bool(member) : +member)  
      index += 1
    }
    else {
      console.log('WARN: ignored unknown member ', member)
    }
  })

  var reconstruct = {}
  reconstruct[name] = finals
  return reconstruct
}
