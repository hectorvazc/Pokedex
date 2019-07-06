import React from "react";
import "../styles.css";

function Pokemon(props) {
  const { item } = props;
  const { front_default, front_shiny, back_default, back_shiny } = item.sprites;

  const t = type => {
    let types = "";
    type.forEach(t => {
      if (types === "") {
        types += `${t.type.name}`;
      } else {
        types += ` ${t.type.name}`;
      }
    });
    return types;
  };

  const types = t(item.types);
  const typeClassName = `flip-container ${types.replace(" ", "")}Type`;

  /*
  const toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  toDataURL(sprites.front_default).then(dataUrl => {
    console.log("RESULT:", dataUrl);
  });
  */

  const weight_height = `${item.height_weight.height} height | ${
    item.height_weight.weight
  } weight`;
  const pokedexNumber = `Pokedex #${item.id}`;
  const pokemonName = `Name : ${item.name}`;
  const pokemonTypes = `Type: ${types}`;

  return (
    <div className={typeClassName}>
      <div className="flipper">
        <div className="front">
          <img src={front_default} alt="sprite-front" />
          <p>
            {pokemonName}
            <br />
            {pokedexNumber}
            <br />
            {pokemonTypes}
            <br />
            {weight_height}
          </p>
        </div>
        <div className="back">
          <img src={front_default} alt="sprite-front-shiny" />
          <img src={back_default} alt="sprite-back" />
          <img src={front_shiny} alt="sprite-front" />
          <img src={back_shiny} alt="sprite-back-shiny" />
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
