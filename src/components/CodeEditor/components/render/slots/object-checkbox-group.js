export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === 'button') {
        list.push(<el-checkbox-button label={item[conf.props.props.value]}>{item[conf.props.props.label]}</el-checkbox-button>)
      } else {
        list.push(<el-checkbox label={item[conf.props.props.value]} border={conf.__config__.border}>{item[conf.props.props.label]}</el-checkbox>)
      }
    })
    return list
  }
}
