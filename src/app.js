import ResultsPage from './components/results-page';
import './components/mikael_tha_front.js'; // #Mikael: calling front end script with click event listener for clicks and conversion tracking.

class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
  }

  _initSearch() {
    this.resultPage = new ResultsPage();
  }
}

const app = new SpencerAndWilliamsSearch();
