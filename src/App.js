import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Table} from 'react-bootstrap';


class App extends Component {
	constructor(props) {
		super(props);
		this.state={
			repository: null,
			language: "python",
			data: null,
			destaque: []
		}
	this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	this.handleSelectChange = this.handleSelectChange.bind(this);
	this.renderResults = this.renderResults.bind(this);
	this.onSavePressed = this.onSavePressed.bind(this)
	this.onRemovePressed = this.onRemovePressed.bind(this)
	this.renderDestaques = this.renderDestaques.bind(this)

	}
	
	
	handleSubmit(event){
		let URL = "https://api.github.com/search/repositories?q="
		let keywords = this.state.repository
		let language = "&language:" + this.state.language
		fetch(URL + keywords + language)
			.then(res => res.json())
				.then(json => this.setState({ data: json }));
		event.preventDefault()
	}

	handleSelectChange(value){
		this.setState({language: value})
	}

	handleTextChange(value){
		let words = value.split(" ")
		value = words.join("+")
		this.setState({repository: value})
		//console.log(value)
	}

	renderResults(){
		console.log(this.state.data)
		if (this.state.data.total_count > 0) {
			return(
				<Table>
					<thead>
					<tr>
					<th >#</th>
					<th>Score</th>
					<th>Name</th>
					<th>URL</th>
					</tr>
					</thead>
					<tbody>
					{this.state.data.items.map((item, i) =>{
						return(
							<tr key={i}>
							<td style={{paddingRight:"5px"}}>{i}</td>
							<td>{item.score}</td>
							<td>{item.name}</td>
							<td><a href={item.url}>{item.url}</a></td>
							<td><button onClick={() => this.onSavePressed(item)}>Save</button></td>
							</tr>
						)
					})}

					</tbody>
				</Table>
			)
		
		} else {
			return(<p>Nenhum repositorio encontrado!</p>)
		}
	}

	onSavePressed(item){
		console.log(item)
		this.setState({destaque: this.state.destaque.concat(item)})
	}

	onRemovePressed(index){
		console.log(index)
		let destaque = this.state.destaque
		let newDestaque = []
		
		for(let i=0; i < destaque.length-1 ;i++){
			if (destaque[i] !== index){
				newDestaque.push(destaque[i])
			}
		}
		console.log(newDestaque)
		this.setState({destaque: newDestaque})
	}

	renderDestaques(){
		return(
				<Table>
					<thead>
					<tr>
					<th >#</th>
					<th>Score</th>
					<th>Name</th>
					<th>URL</th>
					</tr>
					</thead>
					<tbody>
					{this.state.destaque.map((item, i) =>{
						return(
							<tr key={i}>
							<td style={{paddingRight:"5px"}}>{i}</td>
							<td>{item.score}</td>
							<td>{item.name}</td>
							<td><a href={item.url}>{item.url}</a></td>
							<td><button onClick={() => this.onRemovePressed(i)}>Remove</button></td>
							</tr>
						)
					})}

					</tbody>
				</Table>
		)
	}


	render() {
	return (
		<div className="App">
			<div className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
			</div>
			<div className="table-responsive">
				{this.state.destaque.length !== 0  ? this.renderDestaques() : null}
			</div>
			
			<div className="form">
				<form onSubmit={(event)=>{this.handleSubmit(event)}}>
					<label>
						What do you want to search for:<br />
						<input type="text" name="name" onChange={(event) => this.handleTextChange(event.target.value)} />
					</label>
					<br />
					<label>
						Choose a language:<br />
						<select value={this.state.language} onChange={(event) => this.handleSelectChange(event.target.value)}>
							<option value="python">Python</option>
							<option value="java">Java</option>
							<option value="html">HTML</option>
							<option value="css">CSS</option>
							<option value="javascript">JavaScript</option>
						</select>
					</label>
					<br /><br />
					<input type="submit" value="Search" />
				</form>
			</div><br /><br />

			<div className="table-responsive">
				{this.state.data ? this.renderResults() : null}
			</div>
			
		</div>
    );
  }
}

export default App;
