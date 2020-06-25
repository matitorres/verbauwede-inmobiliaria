helpers = {}

helpers.isSelected = (a, b) => {
    if (a === b) {
        return 'selected'
    }
}

helpers.isChecked = (a, b) => {
    if (a) {
        if (a.indexOf(b) > -1) {
            return 'checked'
        }
    }
}

helpers.isActive = (i) => {
    if (i === 0) {
        return 'active'
    }
}

helpers.isCurrentPage = (a, b) => {
    a = parseInt(a)
    b = parseInt(b)
    if (a === b) {
        return 'active'
    }
}

helpers.isCurrentPageTwo = (a, b) => {
    a = parseInt(a)
    b = parseInt(b)
    if (a === b) {
        return 'page'
    }
}

helpers.formatNumber = (a) => {
    return new Intl.NumberFormat("de-DE").format(a)
}

helpers.isNew = (a) => {
    const now = new Date().getTime()
    const propertyDate = a.getTime()
    const diff = now - propertyDate
    const diffInDays = diff/(1000*60*60*24)

    if (diffInDays > 30) {
        return 'hidden'
    } else {
        return ''
    }
}

helpers.sumOne = a => {
    return parseInt(a) + 1
}

helpers.btnFilterSelected = (a,b) => {
    if (a) {
        if (Array.isArray(a)) {
            if (a.indexOf(b) > -1) {
                return 'bg-gradient-custom-primary text-white'
            }
        } else {
            const c = a.replace('+','')
            if (c === b) {
                return 'bg-gradient-custom-primary text-white'
            }
        }
    }
}

module.exports = helpers