import React, { Component } from "react";
import "./styles.css";
import axios from "axios";
import Pokemon from "./components/Pokemon";
import Header from "./components/Header";
import { POKE_API, FIRST_GEN_INDEXES } from "./constants/constants";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      pokedex: JSON.parse(localStorage.getItem("GEN1_PKDX") || "[]"),
      currentGroup: 0,
      groupIndexes: FIRST_GEN_INDEXES,
      filter: 1,
      search: ""
    };
  }

  retrievePokemonData = async results => {
    //console.log(results);
    let pokemon_list = [];

    for (const pokemon of results) {
      console.log(pokemon);

      await axios.get(pokemon.url).then(function(res) {
        pokemon_list.push(
          [res.data].map(pkm => {
            let { move } = pkm.moves;

            return {
              height_weight: { height: pkm.height, weight: pkm.weight },
              id: pkm.id,
              moves: move,
              name: pkm.name.toUpperCase(),
              sprites: pkm.sprites,
              stats: [...pkm.stats, { base_experience: pkm.base_experience }],
              types: pkm.types
            };
          })
        );
      });
    }
    //console.log(pokemon_list);
    return pokemon_list.reduce((arr, pkm) => arr.concat(pkm), []);
  };

  fillPokedex = async (limit = 0, offset = 0) => {
    //let obj_response;

    try {
      this.setState({
        isLoading: true
      });

      const obj_response = await axios.get(
        `${POKE_API}/pokemon/?limit=${limit}&offset=${offset}`
      );

      this.retrievePokemonData(obj_response.data.results).then(response => {
        this.setState({
          isLoading: false,
          pokedex: response
        });
        localStorage.setItem("GEN1_PKDX", JSON.stringify(response));
      });
    } catch (e) {
      console.log(`Error ${e}`);
    }
  };

  componentDidMount() {
    if (this.state.pokedex.length === 0) {
      this.fillPokedex(151); // fill your pokedex object
    }
  }

  handleFilter = () => {
    let filter = this.state.filter;
    this.setState({
      currentGroup: 0,
      filter: filter === 1 ? 0 : 1
    });
  };

  handlePaginationBack = () => {
    let currentGroup = this.state.currentGroup;
    this.setState({
      currentGroup: --currentGroup
    });
  };

  handlePaginationNext = () => {
    let currentGroup = this.state.currentGroup;
    this.setState({
      currentGroup: ++currentGroup
    });
  };

  handlePaginationLast = () => {
    this.setState({
      currentGroup: this.state.groupIndexes.length - 1
    });
  };

  handlePaginationFirst = () => {
    this.setState({
      currentGroup: 0
    });
  };

  handleSearch = e => {
    let value = e.target.value;
    let t_filter;
    if (value !== "") t_filter = 2;
    else t_filter = 1;

    this.setState({
      currentGroup: 0,
      filter: t_filter,
      search: value.toUpperCase()
    });
  };

  render() {
    let { isLoading, currentGroup, filter, search } = this.state;

    if (isLoading) {
      return <div><img src='https://media.giphy.com/media/gWMExaVbLkzu0/giphy.gif' alt='loading-gif' width='120px'></img></div>;
    } else {
      let [lower, upper] = this.state.groupIndexes[currentGroup];

      let PokeObject;

      if (filter === 0) {
        PokeObject = this.state.pokedex
          .slice(lower, upper)
          .map(pkm => <Pokemon key={pkm.id} item={pkm} />);
      } else if (filter === 1) {
        PokeObject = this.state.pokedex.map(pkm => (
          <Pokemon key={pkm.id} item={pkm} />
        ));
      } else if (filter === 2) {
        PokeObject = this.state.pokedex
          .filter(p => p.name.startsWith(search))
          .map(pkm => <Pokemon key={pkm.id} item={pkm} />);
      }

      let previosButton, nextButton, firstButton, lastButton, filterButton;
      if (filter === 0) {
        filterButton = (
          <input
            type="button"
            value="FILTER BY DEX"
            className="btn btn-primary btn-lg"
            onClick={this.handleFilter}
          />
        );
        if (currentGroup === 0) {
          firstButton = (
            <input
              type="button"
              value="FIRST"
              className="btn btn-secondary btn-lg"
              disabled
            />
          );
          previosButton = (
            <input
              type="button"
              value="PREVIOUS"
              className="btn btn-secondary btn-lg"
              disabled
            />
          );
        } else {
          previosButton = (
            <input
              type="button"
              value="PREVIOUS"
              className="btn btn-lg btn-primary"
              onClick={this.handlePaginationBack}
            />
          );
          firstButton = (
            <input
              type="button"
              value="FIRST"
              className="btn btn-lg btn-primary"
              onClick={this.handlePaginationFirst}
            />
          );
        }

        if (currentGroup === this.state.groupIndexes.length - 1) {
          nextButton = (
            <input
              type="button"
              value="NEXT"
              className="btn btn-secondary btn-lg"
              disabled
            />
          );
          lastButton = (
            <input
              type="button"
              value="LAST"
              className="btn btn-secondary btn-lg"
              disabled
            />
          );
        } else {
          nextButton = (
            <input
              type="button"
              value="NEXT"
              className="btn btn-lg btn-primary"
              onClick={this.handlePaginationNext}
            />
          );
          lastButton = (
            <input
              type="button"
              value="LAST"
              className="btn btn-lg btn-primary"
              onClick={this.handlePaginationLast}
            />
          );
        }
      } else if (filter === 1) {
        filterButton = (
          <input
            type="button"
            value="FILTER BY EVOLUTION"
            className="btn btn-primary btn-lg"
            onClick={this.handleFilter}
          />
        );
      }

      return (
        <div>
          <Header searchHandler={this.handleSearch} />
          <div className="flex-container">{filterButton}</div>
          <br />
          <div className="flex-container">{PokeObject}</div>
          <div className="flex-container navigation">
            {firstButton}
            {previosButton}
            {nextButton}
            {lastButton}
          </div>
          <br />
        </div>
      );
    }
  }
}

export default App;
