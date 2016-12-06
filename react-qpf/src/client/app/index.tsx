import * as React from 'react';
import {render} from 'react-dom';

class App extends React.Component<any, any> {
  render (): JSX.Element {
  	let a: string = 's';

    return <p>h h!</p>;
  }
}

render(<App/>, document.getElementById('app'));