import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const ImageUpload = ({ onFileSelect, imageName, imageUrl }) => {
  const [logoData, setLogoData] = useState({ logo_name: imageName, logo_image: imageUrl });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoData({ logo_image: event.target.result, logo_name: file.name });
        onFileSelect(event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        className="form-control form-control-font"
        name="logo_image"
        type="file"
        id="logo_image"
        onChange={handleFileChange}
      />
      <small className="text-danger text-start ms-2"></small>
      <div
        id="imageContainer"
        className="card mt-2"
        style={{ maxWidth: '200px', maxHeight: '200px', width: '150px', minHeight: '90px' }}
      >
        {logoData.logo_image && <img src={logoData.logo_image} alt={logoData.logo_name} />}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  imageName: PropTypes.string,
  imageUrl: PropTypes.string
};

ImageUpload.defaultProps = {
  imageName: '',
  imageUrl: ''
};
