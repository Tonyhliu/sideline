const React = require('react');
const StatsApiUtil = require('../util/stats_api_util');
const Button = require('react-bootstrap').Button;
const Table = require('react-bootstrap').Table;
const hashHistory = require('react-router').hashHistory;

var timeout;

const MlbStats = React.createClass({
  getInitialState() {
    return({ mlbStats: [],
              mlbStatsDup: [],
              isLoading: false,
              sortBy: null,
              sortDir: null});
  },

  _fetchMlbStats(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    StatsApiUtil.getMlbStats(this._updateStats);
  },

  _updateStats(resp) {
    this.setState({ mlbStats: resp,
                      mlbStatsDup: resp});
  },

  _beginFilter(e) {
    let etv;
    if (e.target.value) { etv = e.target.value; }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      this._filterChange(etv);
    }, 500);
  },

  _filterChange(etv) {
    let filteredList = [];
    let regex;
    if (etv === undefined) {
      filteredList = this.state.mlbStatsDup;
    } else {
    regex = etv.toLowerCase();
    for (var idx = 0; idx < this.state.mlbStatsDup.length; idx ++){
        if (this.state.mlbStatsDup[idx].FirstName.toLowerCase().match(regex)
            || this.state.mlbStatsDup[idx].LastName.toLowerCase().match(regex)
            || (this.state.mlbStatsDup[idx].FirstName.toLowerCase() + " " + this.state.mlbStatsDup[idx].LastName.toLowerCase()).match(regex)) {
              filteredList.push(this.state.mlbStatsDup[idx]);
        }
      }
    }
    this.setState({mlbStats: filteredList});
  },

  _resetSearch(e) {
    e.preventDefault();
    this.setState({mlbStats: this.state.mlbStatsDup});
  },

  _handleBack(e) {
    e.preventDefault();
    hashHistory.push('/stats');
  },

  _sortRowsBy(arg) {
    let sortDir = this.state.sortDir; // null to begin with
    let sortBy = this.state.sortBy; // null to begin with
    if (sortDir !== null) {
      sortDir = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
    } else {
      sortDir = 'DESC';
    }

    if (arg !== sortBy) {
      sortDir = 'ASC';
    }

    let data = this.state.mlbStats.slice();
    data.sort((a, b) => {
      let sortVal = 0;
      if (a[arg] > b[arg]) {
        sortVal = 1;
      }
      if (a[arg] < b[arg]) {
        sortVal = -1;
      }

      if (sortDir === 'DESC') {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({ sortDir: sortDir,
                    mlbStats: data,
                    sortBy: arg});
  },

  _fetchMlbNews(Id) {
    // let cb = (resp) => {
    //   if (resp[0]) {
    //     window.open(resp[0].Url, '_blank');
    //   } else {
    //     window.open('http://www.rotoworld.com/sports/mlb/baseball?ls=roto:mlb:gnav', '_blank');
    //   }
    // };
    StatsApiUtil.getMlbNews(Id);
  },

  render() {
    let sortDirArrow = '';
    let renderMlb;
    let isLoading = this.state.isLoading;

    if (this.state.sortDir !== null) {
      sortDirArrow = this.state.sortDir === 'DESC' ? ' ↓' : ' ↑';
    }

    if (this.state.mlbStats.length < 1) {
      if (this.state.mlbStatsDup.length > 0 && isLoading) {
        renderMlb = <div className="no-matches">
                      No Matches found. Click <a href="#"
                                                  className="no-matches-btn"
                                                  onClick={this._resetSearch}>
                                                      here
                                              </a> to go back!
                    </div>;
      } else {
      renderMlb = <div className="fetch-mlb-container">
                    <div className="fetch-mlb-btns">
                      <Button className="fetch-mlb-players"
                              onClick={!isLoading ? this._fetchMlbStats : null}
                              disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Fetch MLB Players'}
                      </Button>
                      <Button className="back-to-stats"
                              onClick={this._handleBack}>
                        Back to other stats
                      </Button>
                    </div>
                    <div className="stats-container">
                      <img className="mlb-stats"
                          src="http://res.cloudinary.com/dcbb8bnvk/image/upload/v1475796972/mlb_sx6hll.png">
                      </img>
                    </div>
                  </div>;
                }
    } else {
      renderMlb = <div className="stats-results-container">
                    <div className="stats-results-btns">
                      <input className="search-players"
                            id="search-bar"
                            type="text"
                            placeholder="Search players..."
                            onChange={this._beginFilter} />
                      <Button className="back-to-stats"
                              onClick={this._handleBack}>
                        Back to stats home
                      </Button>
                    </div>
                    
                    <Table>
                      <thead>
                        <tr>
                          <th></th>
                          <th onClick={this._sortRowsBy.bind(this, "FirstName")}
                              className='sort-by-row'>
                              First Name {this.state.sortBy === "FirstName" ? sortDirArrow : ""}
                          </th>
                          <th onClick={this._sortRowsBy.bind(this, "LastName")}
                              className='sort-by-row'>
                              Last Name {this.state.sortBy === "LastName" ? sortDirArrow : ""}
                          </th>
                            <th onClick={this._sortRowsBy.bind(this, "Team")}
                              className='sort-by-row'>
                              Team {this.state.sortBy === "Team" ? sortDirArrow : ""}
                            </th>
                          <th>Jersey Number</th>
                          <th>Height</th>
                          <th>Weight</th>
                          <th>Bat Hand</th>
                          <th>Throw Hand</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.mlbStats.map(el => {
                          return (<tr key={el.PlayerID}>
                            <td><img className="stats-item-pic"
                                      onClick={this._fetchMlbNews.bind(this, el.PlayerID)}
                                      src={el.PhotoUrl}>
                            </img></td>
                            <td>{el.FirstName}</td>
                            <td>{el.LastName}</td>
                            <td>{el.Team}</td>
                            <td>{el.Jersey}</td>
                            <td>{el.Height}</td>
                            <td>{el.Weight}</td>
                            <td>{el.BatHand}</td>
                            <td>{el.ThrowHand}</td>
                            <td>{el.Position}</td>
                          </tr>);
                        })}
                      </tbody>
                    </Table>
                  </div>;
    }

    return (
      <div className="result-stats-container">
        {renderMlb}
      </div>
    );
  }
});

module.exports = MlbStats;
