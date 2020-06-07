import React from 'react';
import axios from 'axios'


export default class Entities extends React.Component{
  state = {
    links: []
  };

  componentDidMount(){
    axios.get('http://localhost:5002/index')
      .then(res => {
        console.log(res);
        this.setState({links: res.data});
      });
  }

  render(){
    return <a-marker markerhandler emitevents="true" crossorigin="anonymous" cursor='fuse: false; rayOrigin: mouse' id="animated-marker" type='barcode' value='6'>{this.state.links.map(link => <a-image key={link.id} id={link.id} src={link.logo_url} url={link.url} position={`2.5 0 ${-3 + (1.5 * link.id)}`} rotation={'-90 0 0'} opacity="1" transparent="true" alpha-test="0.2" shader="standard" scale='1 1 1' visible='' material='' geometry='' crossOrigin="anonymous" width="1" height="1"></a-image>)}
    </a-marker>;
  }
}
