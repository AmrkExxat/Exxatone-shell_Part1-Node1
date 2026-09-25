class CustomPostAdaptor extends UrlAdaptor {
  processQuery(dm, query, hierarchyFilters) {
    const request = super.processQuery(dm, query, hierarchyFilters);
    request.data = JSON.stringify(request.data); // convert payload to string
    return request;
  }

  makeRequest(request, deffered, args, query) {
    getInternshipsAction('65d302d9a3e1b0205723025e', {}, 1, 50, '', '')
      .then((data) => deffered.resolve({ result: data.data, count: data.totalCount }))
      .catch((error) => deffered.reject([{ error }]));
  }
}
