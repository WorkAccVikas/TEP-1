import React, { useEffect, useState } from 'react';
import { Grid, Stack, InputLabel, Select, MenuItem } from '@mui/material';


const TemplateSelector = ({ onCreateTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    // Load templates from localStorage
    const storedTemplate = localStorage.getItem('excelHeaderTemplate');
    if (storedTemplate) {
      setTemplates(JSON.parse(storedTemplate)); // Assume stored data is an array of templates
    }
  }, []);

  const handleTemplateSelect = (event) => {
    const value = event.target.value;
    if (value === 'create') {
      onCreateTemplate(); // Trigger the parent method to open the create template dialog
    } else {
      const template = JSON.parse(value);
      setSelectedTemplate(template);
      console.log('Selected Template:', template);
    }
  };

  return (
   
      <Stack spacing={1}>
        <InputLabel htmlFor="templateSelector">Select Excel Template</InputLabel>
        <Select
          onChange={handleTemplateSelect}
          defaultValue=""
          displayEmpty
        >
          <MenuItem value="" disabled>Select a Template</MenuItem>
          {templates.length > 0 ? (
            templates.map((template, index) => (
              <MenuItem key={index} value={JSON.stringify(template)}>
                {template.templateName}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>No templates found</MenuItem>
          )}
          <MenuItem value="create">Create Template</MenuItem>
        </Select>
      </Stack>
    
    
  );
};

export default TemplateSelector;
