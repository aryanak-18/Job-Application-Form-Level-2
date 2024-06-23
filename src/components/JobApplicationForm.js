import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Summary from './Summary';

const jobSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: yup.number().typeError('Phone Number must be a number').required('Phone Number is required').positive('Phone Number is invalid'),
  position: yup.string().required('Position is required'),
  relevantExperience: yup
    .number()
    .positive("Experience should be greater than 0")
    .typeError('Relevant Experience must be a number')
    .when('position', {
      is: (val) => val === 'Developer' || val === 'Designer',
      then: (schema) => schema.min(1, 'Experience must be greater than 0').required('Relevant Experience is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  portfolioUrl: yup
    .string()
    .url('Invalid URL format')
    .when('position', {
      is: 'Designer',
      then: (schema) => schema.required('Portfolio URL is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  managementExperience: yup
    .number()
    .positive("Experience should be greater than 0")
    .when('position', {
      is: 'Manager',
      then: (schema) => schema.required('Management Experience is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  additionalSkills: yup.array().of(yup.string()).min(1, 'At least one skill must be selected'),
  preferredInterviewTime: yup.date().required('Preferred Interview Time is required'),
});

const JobApplicationForm = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      additionalSkills: [],
    },
  });

  const watchPosition = watch('position', '');

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    let updatedSkills = [...selectedSkills];
    if (checked) {
      updatedSkills.push(value);
    } else {
      updatedSkills = updatedSkills.filter((skill) => skill !== value);
    }
    setSelectedSkills(updatedSkills);
    setValue('additionalSkills', updatedSkills);
  };

  const onSubmit = (data) => {
    setSubmittedData(data);
  };

  return (
    <div>
      {!submittedData ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='labels'>Full Name</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => <input type='text' {...field} />}
            />
            {errors.fullName && <p>{errors.fullName.message}</p>}
          </div>

          <div>
            <label className='labels'>Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <input type="email" {...field} />}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label className='labels'>Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <input type="text" {...field} />}
            />
            {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className='labels'>Applying for Position</label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  <option value="">Select...</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                </select>
              )}
            />
            {errors.position && <p>{errors.position.message}</p>}
          </div>

          {(watchPosition === 'Developer' || watchPosition === 'Designer') && (
            <div>
              <label className='labels'>Relevant Experience (years)</label>
              <Controller
                name="relevantExperience"
                control={control}
                render={({ field }) => <input type="number" {...field} />}
              />
              {errors.relevantExperience && <p>{errors.relevantExperience.message}</p>}
            </div>
          )}

          {watchPosition === 'Designer' && (
            <div>
              <label className='labels'>Portfolio URL</label>
              <Controller
                name="portfolioUrl"
                control={control}
                render={({ field }) => <input type="text" {...field} />}
              />
              {errors.portfolioUrl && <p>{errors.portfolioUrl.message}</p>}
            </div>
          )}

          {watchPosition === 'Manager' && (
            <div>
              <label className='labels'>Management Experience</label>
              <Controller
                name="managementExperience"
                control={control}
                render={({ field }) => <input type="number" {...field} />}
              />
              {errors.managementExperience && <p>{errors.managementExperience.message}</p>}
            </div>
          )}

          <div>
            <label className='labels'>Additional Skills</label>
            <div className='add-skills'>
              <label>
                <input type="checkbox" value="JavaScript" checked={selectedSkills.includes('JavaScript')} onChange={handleSkillChange} />
                JavaScript
              </label>
              <label>
                <input type="checkbox" value="CSS" checked={selectedSkills.includes('CSS')} onChange={handleSkillChange} />
                CSS
              </label>
              <label>
                <input type="checkbox" value="Python" checked={selectedSkills.includes('Python')} onChange={handleSkillChange} />
                Python
              </label>
            </div>
            {errors.additionalSkills && <p>{errors.additionalSkills.message}</p>}
          </div>

          <div>
            <label className='labels'>Preferred Interview Time</label>
            <Controller
              name="preferredInterviewTime"
              control={control}
              render={({ field }) => <input type="datetime-local" {...field} />}
            />
            {errors.preferredInterviewTime && <p>{errors.preferredInterviewTime.message}</p>}
          </div>

          <button type="submit">Submit</button>
        </form>
      ) : (
        <Summary data={submittedData} />
      )}
    </div>
  );
};

export default JobApplicationForm;
