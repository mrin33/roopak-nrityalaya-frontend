import React, { useState, useEffect } from 'react';

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    level: '',
    description: '',
    file: null
  });

  useEffect(() => {
    // TODO: Fetch uploaded resources from API
    setResources([
      { 
        id: 1, 
        title: 'Basic Footwork Techniques', 
        type: 'video', 
        level: 'Praveshika Pratham', 
        uploadDate: '2026-01-15', 
        fileSize: '45 MB' 
      },
      { 
        id: 2, 
        title: 'Taal Practice - Teen Taal', 
        type: 'audio', 
        level: 'Praveshika Pratham', 
        uploadDate: '2026-01-10', 
        fileSize: '12 MB' 
      },
      { 
        id: 3, 
        title: 'Hand Gestures Guide', 
        type: 'document', 
        level: 'Madhyama Pratham', 
        uploadDate: '2026-01-05', 
        fileSize: '2 MB' 
      },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Upload file to server
    alert('Resource will be uploaded! (File upload API needed)');
    setShowUploadForm(false);
    setFormData({ title: '', type: 'video', level: '', description: '', file: null });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'video') {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    } else if (type === 'audio') {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getTypeColor = (type) => {
    if (type === 'video') return 'from-red-500 to-red-600';
    if (type === 'audio') return 'from-blue-500 to-blue-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Learning Resources
            </h1>
            <p className="text-gray-600">Upload videos, audio files, and documents for students</p>
          </div>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="btn-primary"
          >
            + Upload New
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Resources</p>
            <p className="text-3xl font-bold text-primary">{resources.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Videos</p>
            <p className="text-3xl font-bold text-red-600">
              {resources.filter(r => r.type === 'video').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Audio Files</p>
            <p className="text-3xl font-bold text-blue-600">
              {resources.filter(r => r.type === 'audio').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Documents</p>
            <p className="text-3xl font-bold text-green-600">
              {resources.filter(r => r.type === 'document').length}
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                
                {/* Resource Icon */}
                <div className={`h-32 bg-gradient-to-br ${getTypeColor(resource.type)} flex items-center justify-center text-white`}>
                  {getTypeIcon(resource.type)}
                </div>

                {/* Resource Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      resource.type === 'video' ? 'bg-red-100 text-red-700' :
                      resource.type === 'audio' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500">{resource.fileSize}</span>
                  </div>

                  <h3 className="text-lg font-bold text-accent mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resource.level}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Uploaded: {new Date(resource.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-secondary text-sm">Edit</button>
                    <button 
                      onClick={() => handleDelete(resource.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 text-xl mb-2">No resources yet</p>
            <button 
              onClick={() => setShowUploadForm(true)}
              className="btn-primary mt-4"
            >
              Upload Your First Resource
            </button>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="bg-primary text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Upload Resource</h2>
                  <button 
                    onClick={() => setShowUploadForm(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="E.g., Basic Footwork Techniques"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="document">Document (PDF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Level *</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select level</option>
                      <option value="Praveshika Pratham">Praveshika Pratham</option>
                      <option value="Praveshika Purna">Praveshika Purna</option>
                      <option value="Madhyama Pratham">Madhyama Pratham</option>
                      <option value="Madhyama Purna">Madhyama Purna</option>
                      <option value="Visharad Pratham">Visharad Pratham</option>
                      <option value="Visharad Purna">Visharad Purna</option>
                      <option value="Alankar Pratham">Alankar Pratham</option>
                      <option value="Alankar Purna">Alankar Purna</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field"
                    placeholder="Describe the content..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">Upload File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={
                        formData.type === 'video' ? 'video/*' :
                        formData.type === 'audio' ? 'audio/*' :
                        '.pdf'
                      }
                      className="hidden"
                      id="fileUpload"
                      required
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {formData.file ? (
                        <p className="text-primary font-semibold">{formData.file.name}</p>
                      ) : (
                        <>
                          <p className="text-gray-600 mb-2">Click to upload</p>
                          <p className="text-sm text-gray-500">
                            {formData.type === 'video' && 'MP4, AVI, MOV'}
                            {formData.type === 'audio' && 'MP3, WAV, AAC'}
                            {formData.type === 'document' && 'PDF only'}
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherResources;
