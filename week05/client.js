const net = require('net');
const images = require('images');
const parser = require('../week06/parser');
const render = require('../week07/render');


class Request {
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body;
        this.headers = options.headers || {};
        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/www-form-urlencoded';
        }
        if(this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if(this.headers['Content-Type'] === 'application/www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&');
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }

    send() {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            const connection = net.createConnection({
                host: this.host,
                port: this.port
            }, () => {
                connection.write(this.toString());
            });
    
            connection.on('data', (data) => {
                parser.receive(data.toString());
                if (parser.isFinish) {
                    resolve(parser.response);
                    connection.end();
                }
            });
    
            connection.on('end', () => {
                console.log('request end!');
            });
    
            connection.on('error', (err) => {
                reject(err);
            });
        });
    }
}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;
        this.WAITING_BODY_END = 8;

        this.current = this.WAITING_STATUS_LINE;

        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';

        this.bodyParser = null;


    }

    get isFinish() {
        return this.current === this.WAITING_BODY_END;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.response
        }
    }

    receive(string) {
        for(let i = 0; i < string.length; i++) {
            this.receiveChar(string[i]);
        }
    }

    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        }else if (this.current === this.WAITING_STATUS_LINE_END){
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
            } else if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else {
                this.headerName += char;
            }
        }else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        }else if(this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        }else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new BodyParser();
                }
            }
        }else if (this.current === this.WAITING_BODY) {
            if (!this.bodyParser.isFinish) {
                this.bodyParser.receiveChar(char);
            } else {
                this.current = this.WAITING_BODY_END;
            }
        }
    }
}

class BodyParser {
    constructor() {
        this.WAITING_COUNT = 0;
        this.WAITING_COUNT_END = 1;
        this.WAITING_STRING = 2;
        this.WAITING_STRING_END = 3;
        this.WAITING_BODY_END = 4;

        this.current = this.WAITING_COUNT;
        this.count = 0;
        this.bodyText = '';

    }

    get isFinish() {
        return this.current === this.WAITING_BODY_END;
    }

    get response() {
        return this.bodyText;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_COUNT) {
            if (char === '\r') {
                if (this.count) {
                    this.current = this.WAITING_COUNT_END;
                } else {
                    this.current = this.WAITING_BODY_END;
                }
            } else {
                this.count = this.count * 16 + parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_COUNT_END) {
            if (char === '\n') {
                this.current = this.WAITING_STRING;
            }
        } else if (this.current === this.WAITING_STRING) {
            if (this.count) {
                this.bodyText += char;
                this.count--;
            } else {
                this.current = this.WAITING_STRING_END;
            }
        } else if (this.current === this.WAITING_STRING_END) {
            if (char === '\n') {
                this.current = this.WAITING_COUNT;
            }
        }
    }
}

let request = new Request({
    host: '127.0.0.1',
    port: 8088,
    method: 'POST',
    path: '/',
    headers: {
        'Content-Type': 'application/json',
        'Custom-Head': 'custom'
    },
    body: {
        a: 1,
        b: 2
    }
});

request.send().then(res => {
    let dom = parser.parseHTML(res.body);
    let viewport = images(100, 100);
    render(viewport, dom.children[0].children[3].children[3]);
    viewport.save('result.jpg');
});
