const React = require('react');
const PropTypes = React.PropTypes;

const UploadButton= React.createClass({
  getInitialState: function() {
    return({ images: [] });
  },

  postImage: function(url) {
    const img = {url: url};
    $.ajax({
      url: "/api/stories",
      method: "POST",
      data: {image: img},
      success: function(image) {
        const images = this.state.images;
        images.push(image);
        this.setState({ images: images });
      }.bind(this)
    });
  },

  _upload: function(e) {
    e.preventDefault();
    window.cloudinary.openUploadWidget(
      window.cloudinary_options,
      function(error, images){
        if (error === null) {
          this.props.postImage(images[0].url);
        }
    });
  },

  render: function() {
    return (
      <button onClick={this._upload}>Upload Image</button>
    );
  }

});

module.exports = UploadButton;
