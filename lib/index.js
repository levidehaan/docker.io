String.prototype.isJson = function() {
    try {
        JSON.parse(this);
    } catch (e) {
        return false;
    }
    return true;
};


var Endpoint = require('./endpoint'),
    validator = require('flat-validator');


var Docker = function(opts) {
    opts = opts || {};

    var socketPath,
        version = opts.version || "v1.6",
        port = opts.port || '7483',
        host = opts.host || "http://localhost",
        host = host + ':' + port + '/';

    // If socketPath is false, use TCP
    // otherwise, use the socketPath specified or the default.
    if(opts.socketPath === false) {
        socketPath = false;
    } else {
        socketPath = opts.socketPath || '/var/run/docker.sock';
    }

    return {
        containers: {
            list: new Endpoint('options', {
                path: '/containers/json',
                method: 'GET',
                codes: {
                    200: true,
                    400: "bad parameter",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            create: new Endpoint('options', {
                path: '/containers/create',
                method: 'POST',
                args: {
                    Image: {
                        required: true,
                        type: 'string'
                    },
                    Cmd: {
                        required: true,
                        type: 'array'
                    }
                },
                codes: {
                    201: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            inspect: new Endpoint('id', {
                path: '/containers/${id}/json',
                method: 'GET',
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            inspectChanges: new Endpoint('id', {
                path: '/containers/${id}/changes',
                method: 'GET',
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            runExport: new Endpoint('id', {
                path: '/containers/${id}/export',
                method: 'GET',
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            start: new Endpoint('id', {
                path: '/containers/${id}/start',
                method: 'POST',
                args: {},
                codes: {
                    204: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            stop: new Endpoint('options', {
                path: '/containers/${id}/stop',
                method: 'POST',
                codes: {
                    204: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            restart: new Endpoint('options', {
                path: '/containers/${id}/restart',
                method: 'POST',
                codes: {
                    204: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            kill: new Endpoint('id', {
                path: '/containers/${id}/kill',
                method: 'POST',
                codes: {
                    204: true,
                    400: "bad parameter",
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            remove: new Endpoint('id', {
                path: '/containers/${id}',
                method: 'DELETE',
                codes: {
                    204: true,
                    400: "bad parameter",
                    404: "no such container",
                    406: "no container found",// docker bug
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            attach: new Endpoint('id', {
                path: '/containers/${id}/attach',
                method: 'POST',
                forceURLParams: true,
                streamReply: true,
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            top: new Endpoint('id', {
                path: '/containers/${id}/top',
                method: 'GET',
                forceURLParams: true,
                streamReply: true,
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            copy: new Endpoint('id', {
                path: '/containers/${id}/copy',
                method: 'GET',
                forceURLParams: true,
                streamReply: true,
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            diff: new Endpoint('id', {
                path: '/containers/${id}/changes',
                method: 'GET',
                forceURLParams: true,
                streamReply: true,
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),
            wait: new Endpoint('id', {
                path: '/containers/${id}/wait',
                method: 'POST',
                streamReply: true,
                codes: {
                    201: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            })

        },
        images: {
            list: new Endpoint('options', {
                path: '/images/json',
                method: 'GET',
                codes: {
                    200: true,
                    400: "bad parameter",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),

            getInfo: new Endpoint('id', {
                path: 'images/${id}/json',
                method: 'GET',
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            }),

            history: new Endpoint('id', {
                path: 'images/${id}/history',
                method: 'GET',
                codes: {
                    200: true,
                    404: "no such container",
                    500: "server error"
                },
                host: host,
                socketPath: socketPath
            })

        },
        info: new Endpoint('options', {
            path: '/info',
            method: 'GET',
            streamReply: true,
            codes: {
                200: true,
                500: "server error"
            },
            host: host,
            socketPath: socketPath
        }),
        version: new Endpoint('options', {
            path: '/version',
            method: 'GET',
            codes: {
                200: true,
                500: "server error"
            },
            host: host,
            socketPath: socketPath
        }),
        setAuth: new Endpoint('options', {
            path: '/auth',
            method: 'POST',
            args: {
                username: {
                    required: true,
                    type: 'string'
                },
                email: {
                    required: true,
                    type: 'string',
                    regex: validator.regex.email
                },
                password: {
                    required: true,
                    type: 'string'
                }
            },
            codes: {
                200: true,
                204: true,
                500: "server error"
            },
            host: host,
            socketPath: socketPath
        }),
        commit: new Endpoint('id', {
            path: '/commit?container=${id}',
            method: 'POST',
            args: {
                repo: {
                    required: true,
                    type: 'string'
                },
                tag: {
                    required: true,
                    type: 'string'
                },
                message: {
                    required: true,
                    type: 'string'
                }
            },
            codes: {
                201: true,
                404: "no such container",
                500: "server error"
            },
            host: host,
            socketPath: socketPath
        }),
        build: new Endpoint('file', {
            path: '/build',
            method: 'POST',
            codes: {
                200: true,
                500: "server error"
            },
            host: host,
            socketPath: socketPath
        })
    };
};

module.exports = Docker;