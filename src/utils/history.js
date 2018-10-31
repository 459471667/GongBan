import createBrowserHistory from 'history/createBrowserHistory';

export const history = createBrowserHistory();

// nav to uri page
export const navPage = (uri) => {
    history.push(uri)
};
export const navBack = () => {
    history.goBack()
};