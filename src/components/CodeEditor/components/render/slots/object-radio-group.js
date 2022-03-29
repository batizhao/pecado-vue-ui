export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === 'button') {
        list.push(<el-radio-button label={item[conf.props.props.value]}>{item[conf.props.props.label]}</el-radio-button>)
      } else {
        list.push(<el-radio label={item[conf.props.props.value]} border={conf.__config__.border}>{item[conf.props.props.label]}</el-radio>)
      }
    })
    return list
  }
}
