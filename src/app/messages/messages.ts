export const Messages = {
    status500: 'The server encountered an unexpected condition which prevented it from fulfilling the request.',
    status400: 'The request had bad syntax or was inherently impossible to be satisfied.',
    status403: 'You do not have sufficient rights to access the requested resource.',
    status404: 'The server has not found anything matching the URI given.',
    status405: 'A request was made of a page using a request method not supported by that page',
    status406: 'The server can only generate a response that is not accepted by the client',
    status407: 'The client must first authenticate itself with the proxy',
    status408: 'The server timed out waiting for the request',
    status415: 'The server will not accept the request, because the media type is not supported ',
    status501: 'The server does not support the facility required.',
    status502: 'Backend server is restarting at the moment. Please wait several seconds and repeat your request/action.',
    status503: 'The server is currently unavailable (overloaded or down)',
    status504: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server',
    status505: 'The server does not support the HTTP protocol version used in the request',
    status0:'Backend server is restarting. Please wait few moments and try to refresh the page.',
    wrongMessage: 'Something went wrong!',
    tokenNotFound: 'JWT Token not found!',
    graphQlCommonErrorMessage: 'An unexpected error occurred while trying to fetch the requested data.',
    commonErrorHeaderText: 'Error!',
    asset: {
        filter: {
            embedded_and_opensource: "Embedded and open source assets"
        }
    }
};
