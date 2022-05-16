const rule = (form) => {
  //console.log(form, 'updateRule.js')
  return {
    machineTypeForChange: [
      {required: true, message: '请选择农机类型', trigger: 'change'}
    ],
    jobStartTimeForChange: [
      {required: true, message: '请输入作业开始时间', trigger: 'change'}
    ],
    jobEndTimeForChange: [
      {required: true, message: '请输入作业结束时间', trigger: 'change'}
    ],
    JobTypeForChange: [
      {required: true, message: '请选择作业类型', trigger: 'change'}
    ],
    depMinForChange: [
      { trigger: 'blur',
        validator: (rule, value, callback) => {
          if(value) {
            if(Number(form.depMaxForChange) && Number(value) >= Number(form.depMaxForChange)) {
              return callback(new Error('作业深度输入有误'))
            } else {
              callback()
            }
            callback()
          }
        }
      }
    ],
    depMaxForChange: [
      { trigger: 'blur',
        validator: (rule, value, callback) => {
          if(value) {
            if(Number(form.depMinForChange) && Number(value) <= Number(form.depMinForChange)) {
              return callback(new Error('作业深度输入有误'))
            } else {
              callback()
            }
            callback()
          }
        }
      }
    ],
    depRateMinForChange: [
      { trigger: 'blur',
        validator: (rule, value, callback) => {
          if(value) {
            if(Number(form.depRateMaxForChange) && Number(value) <= Number(form.depRateMaxForChange)) {
              return callback(new Error('深度合格率输入有误'))
            } else {
              callback()
            }
            callback()
          }
        }
      }
    ],
    depRateMaxForChange: [
      { trigger: 'blur',
        validator: (rule, value, callback) => {
          if(value) {
            if(Number(form.depRateMinForChange) && Number(value) <= Number(form.depRateMinForChange)) {
              return callback(new Error('深度合格率输入有误'))
            } else {
              callback()
            }
            callback()
          }
        }
      }
    ]
  }
}

export default rule;