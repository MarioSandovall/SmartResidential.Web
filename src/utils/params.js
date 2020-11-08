const params = new URLSearchParams()

params.append('page', this.page)

params.append('itemsPerPage', this.itemsPerPage)

if (this.sortBy !== undefined) {
  params.append('sortBy', this.sortBy)
}

if (this.isSortDesc !== undefined) {
  params.append('isSortDesc', this.isSortDesc)
}

if (this.filter !== undefined && this.filter !== '') {
  params.append('filter', this.filter)
}

export default params
