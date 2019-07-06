import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="!#">
          Navbar
        </a>
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={this.props.searchHandler}
          />
        </form>
      </nav>
    );
  }
}

export default Header;
