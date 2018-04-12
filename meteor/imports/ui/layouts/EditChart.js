import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Presence } from 'meteor/tmeasday:presence';
import generateRandomAnimalName from 'random-animal-name-generator';
import Charts from '../../api/Charts/Charts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChartType from '../components/ChartType';
import ChartPreview from '../components/ChartPreview';
import ChartOutput from '../components/ChartOutput';
import ChartOverlays from '../components/ChartOverlays';
import ChartStatus from '../components/ChartStatus';
import ChartData from '../components/ChartData';
import ChartXAxis from '../components/ChartXAxis';
import ChartYAxis from '../components/ChartYAxis';
import ChartAnnotations from '../components/ChartAnnotations';
import ChartTags from '../components/ChartTags';
import ChartStyling from '../components/ChartStyling';
import ChartOptions from '../components/ChartOptions';

class EditChart extends Component {

  constructor(props) {
    super(props);
    const animalName = generateRandomAnimalName();
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.toggleAnnotationMode = this.toggleAnnotationMode.bind(this);
    this.handleHighlightColor = this.handleHighlightColor.bind(this);
    Presence.state = () => {
      return { currentChartId: this.props.match.params._id, user: animalName };
    };
    this.state = {
      animalName,
      overlay: false,
      annotationMode: false,
      currentAnnotation: {
        highlight: '',
        type: null,
        text: [],
        range: []
      }
    };
  }

  toggleOverlay(event) {
    const overlay = event.target.value === this.state.overlay ? false : event.target.value;
    this.setState({ overlay });
  }

  toggleAnnotationMode(annotationMode) {
    this.setState({ annotationMode });
  }

  handleHighlightColor(event) {
    const currentAnnotation = this.state.currentAnnotation;
    currentAnnotation.highlight = event.hex;
    this.setState({ currentAnnotation });
  }

  renderPage() {
    return (
      <div>
        <Header edit={true} {...this.props} />
        <section>
          <article className='main-area'>
            <ChartType
              {...this.props}
            />
            <ChartPreview
              annotationMode={this.state.annotationMode}
              currentAnnotation={this.state.currentAnnotation}
              {...this.props}
            />
            <ChartOutput
              toggleOverlay={this.toggleOverlay}
              {...this.props}
            />
            <ChartOverlays
              overlay={this.state.overlay}
              toggleOverlay={this.toggleOverlay}
              {...this.props}
            />
          </article>
          <aside className='options-area'>
            <ChartStatus
              name={this.state.animalName}
              {...this.props}
            />
            <ChartData
              {...this.props}
            />
            <ChartXAxis
              {...this.props}
            />
            <ChartYAxis
              {...this.props}
            />
            <ChartAnnotations
              annotationMode={this.state.annotationMode}
              toggleAnnotationMode={this.toggleAnnotationMode}
              handleHighlightColor={this.handleHighlightColor}
              {...this.props}
            />
            <ChartTags
              {...this.props}
            />
            <ChartStyling
              {...this.props}
            />
            <ChartOptions
              {...this.props}
            />
          </aside>
        </section>
        <Footer />
      </div>
    );
  }

  render() {
    if (!this.props.loading && !this.props.chart) {
      return <Redirect to='/404' />;
    }
    return !this.props.loading ? this.renderPage() : null;
  }

}

export default withTracker(props => {
  const subscription = Meteor.subscribe('chart', props.match.params._id);
  return {
    loading: !subscription.ready(),
    chart: Charts.findOne({ _id: props.match.params._id })
  };
})(EditChart);
