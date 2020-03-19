export const MODEL_LIFECYCLE = [
  {
    id: 1,
    name: 'Product1_StepA',
    models: [
      {
        id: 1,
        name: 'Step A ADC Model 001',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 5,
            status: 'Training',
            startTime: '2020-06-01',
            endTime: 'Now',
            duration: 0
          }
        ]
      },
      {
        id: 2,
        name: 'Step A ADC Model 002',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 3,
            status: 'Production',
            startTime: '2020-02-15',
            endTime: '2020-04-15',
            duration: 60
          },
          {
            id: 4,
            status: 'Disable',
            startTime: '2020-04-15',
            endTime: '2020-06-01',
            duration: 45
          },
          {
            id: 5,
            status: 'Pirun',
            startTime: '2020-06-01',
            endTime: 'Now',
            duration: 0
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Product1_StepB',
    models: [
      {
        id: 1,
        name: 'Step B ADC Model 001',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 3,
            status: 'Production',
            startTime: '2020-02-15',
            endTime: '2020-04-15',
            duration: 60
          }
        ]
      },
      {
        id: 2,
        name: 'Step B ADC Model 002',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 3,
            status: 'Production',
            startTime: '2020-02-15',
            endTime: '2020-04-15',
            duration: 60
          },
          {
            id: 4,
            status: 'Disable',
            startTime: '2020-04-15',
            endTime: '2020-06-01',
            duration: 45
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Product2_StepA',
    models: [
      {
        id: 1,
        name: 'Step A ADC Model 001',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 3,
            status: 'Production',
            startTime: '2020-02-15',
            endTime: '2020-04-15',
            duration: 60
          }
        ]
      },
      {
        id: 2,
        name: 'Step A ADC Model 002',
        lifecycle: [
          {
            id: 1,
            status: 'Training',
            startTime: '2020-01-01',
            endTime: '2020-02-01',
            duration: 30
          },
          {
            id: 2,
            status: 'Pirun',
            startTime: '2020-02-01',
            endTime: '2020-02-15',
            duration: 15
          },
          {
            id: 3,
            status: 'Production',
            startTime: '2020-02-15',
            endTime: '2020-04-15',
            duration: 60
          },
          {
            id: 4,
            status: 'Disable',
            startTime: '2020-04-15',
            endTime: '2020-06-01',
            duration: 45
          }
        ]
      }
    ]
  }
]
