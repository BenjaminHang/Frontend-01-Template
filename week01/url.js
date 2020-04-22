function PatchyURL(url) {
  if (url === undefined) return new Error('Failed to construct "URL": 1 argument required, but only 0 present.')
  let urlError = 'Failed to construct "URL": Invalid URL'
  if (typeof url !== 'string') return new Error(urlError)
  
  this.href = url;

  let _url = url
  
  let index = _url.indexOf(':')
  this.protocol = _url.substring(0, index + 1)
  if (!/^[a-zA-Z][a-zA-Z0-9]*:$/.test(this.protocol)) return new Error(urlError)
  _url = _url.substring(index + 1)
  _url.replace(/^\/*/, '')
  
  index = _url.indexOf('/')
  let domain = _url.substring(0, index)
  if (!domain) return new Error(urlError)
  let domainArr = domain.split(':')
  if (domainArr.length > 2) return new Error(urlError)
  this.port = domainArr[1] || ''
  if (this.port) {
    const portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (!portReg.test(domainArr[1])) return new Error(urlError)
  }
  let atIndex = domainArr[0].lastIndexOf('@')
  this.hostname = domainArr[0].substring(atIndex + 1)
  this.host = this.hostname + (this.port ? ':' + this.port : '');
  this.username = domainArr[0].substring(0, atIndex);
  _url = _url.substring(index + 1)

  let hashIndex = _url.indexOf('#')
  this.hash = _url.substring(hashIndex)
  _url = _url.substring(0, hashIndex)

  let queryIndex = _url.indexOf('?')
  this.search = _url.substring(queryIndex)
  this.pathname = '/' + _url.substring(0, queryIndex)
}
