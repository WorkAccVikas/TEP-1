// ==============================|| UPLOAD - DETAILS  ||============================== //

export default function getDropzoneData(file, index) {
  const isExistingFile = typeof file.preview === 'string' && file.preview.startsWith('http');
  const data = {
    key: file.key || index,
    name: file.name || (isExistingFile ? file.preview.split('/').pop().split('?')[0] : 'Unnamed File'),
    size: file.size || 0,
    preview: file.preview || null,
    type: file.type || 'application/octet-stream'
  };

  console.log('Processed file:', data); // Debugging log
  return data;

  // if (typeof file === 'string') {
  //   return {
  //     key: index ? `${file}-${index}` : file,
  //     preview: file
  //   };
  // }

  // return {
  //   key: index ? `${file.name}-${index}` : file.name,
  //   name: file.name,
  //   size: file.size,
  //   path: file.path,
  //   type: file.type,
  //   preview: file.preview,
  //   lastModified: file.lastModified,
  //   lastModifiedDate: file.lastModifiedDate
  // };
}
