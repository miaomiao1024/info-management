import React, { Component } from 'react'
import T from 'prop-types'
import { Input, message } from 'antd'

export default class extends Component {
  static propTypes = {
    templateTag: T.array,
    templateTagCallback: T.func,
    onChange: T.func.isRequired,
    onBlur: T.func.isRequired,
    value: T.string,
    placeholder: T.string,
    disabled: T.bool,
    pushChannel: T.string,
  }

  static defaultProps ={
    value: '',
    placeholder: '',
    templateTag: [],
    templateTagCallback: () => {},
    disabled: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      pushText: props.value,
    }
  }
  componentWillReceiveProps(nextProps) {
    const nextTemplateTag = nextProps.templateTag
    const templateTag = this.props.templateTag
    const value = nextProps.value
    const preValue = this.props.value
    // const { pushText } = this.state


    const templateProFlag = () => {
      if (templateTag.length > 0 && nextTemplateTag.length > 0) {
        for (let i = 0; i < templateTag.length; i++) {
          if (templateTag[i].checkedCount !== nextTemplateTag[i].checkedCount) {
            return true
          }
        }
      }
      return false
    }
    if (value !== preValue) {
      this.setState({ pushText: value }, () => {
        if (templateProFlag()) {
          this.caculateTemplateTag(nextTemplateTag, value)
        }
      })
    } else if (templateProFlag()) {
      this.caculateTemplateTag(nextTemplateTag, value)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pushText: prePushText } = this.state
    const { pushText } = nextState
    if (prePushText === pushText) {
      return false
    }
    return true
  }
  onMouseUpHandler=(evt) => {
    evt = evt || window.event
    const { target } = evt
    const sel = this.getInputSelection(target)
    const val = target.value
    let subStr
    const moveLeft = () => {
      subStr = val.substring(0, sel.end)
      for (let i = sel.end; i >= 0; i--) {
        let len = 0
        if (subStr.charAt(i) === '{') {
          len = sel.end - i
          this.setCursorPosition(target, sel.end - len)
          return
        }
      }
    }
    const moveRight = () => {
      for (let i = sel.end; i < val.length; i++) {
        let len = 0
        if (val.charAt(i) === '}') {
          len = i - sel.end
          this.setCursorPosition(target, sel.end + len + 1)
          return
        }
      }
    }
    const str = val.substring(sel.start, sel.end).replace(/[^{}]/ig, '')
    if (str.length > 0 && str[str.length - 1] === '{') {
      evt.preventDefault()
      subStr = val.substring(0, sel.end)
      moveRight()
    }
    if (str.length > 0 && str[0] === '}') {
      evt.preventDefault()
      subStr = val.substring(0, sel.end)
      moveLeft()
    }
  }
  onKeyDownHandler =(evt) => {
    evt = evt || window.event
    const { onChange } = this.props
    const { target } = evt
    const keyCode = evt.keyCode
    const deleteKey = (keyCode === 46)
    const backspaceKey = (keyCode === 8)
    const { templateTag, templateTagCallback } = this.props
    let deletedText
    let subStr
    let subStr2
    // let deleteStr
    let result
    if (keyCode === 219 || keyCode === 221) {
      evt.preventDefault()
      return
    }
    const sel = this.getInputSelection(target)
    const val = target.value
    const moveLeft = () => {
      subStr = val.substring(0, sel.end)
      for (let i = sel.end; i >= 0; i--) {
        let len = 0
        if (subStr.charAt(i) === '{') {
          len = sel.end - i
          this.setCursorPosition(target, sel.end - len)
          return
        }
      }
    }
    const moveRight = () => {
      for (let i = sel.end; i < val.length; i++) {
        let len = 0
        if (val.charAt(i) === '}') {
          len = i - sel.end
          this.setCursorPosition(target, sel.end + len + 1)
          return
        }
      }
    }
    if (keyCode === 37) {
      const strMove = val.charAt(sel.end - 1)
      if (strMove === '}') {
        evt.preventDefault()
        moveLeft()
      }
    }
    if (keyCode === 39) {
      const strMove = val.charAt(sel.end)
      if (strMove === '{') {
        evt.preventDefault()
        moveRight()
      }
    }
    const str = val.substring(0, sel.end).replace(/[^{}]/ig, '')
    if (str.length > 0 && str[str.length - 1] === '{') {
      evt.preventDefault()
      subStr = val.substring(0, sel.end)
      if (keyCode === 37) {
        moveLeft()
      }
      if (keyCode === 39) {
        moveRight()
      }
    }
    if (deleteKey || backspaceKey) {
      if (sel.length) {
        deletedText = val.slice(sel.start, sel.end)
      } else {
        deletedText = val.charAt(deleteKey ? sel.start : sel.start - 1)
      }
      //   console.info(`About to be deleted: ${deletedText}`)
      if (deletedText === '}') {
        subStr = val.substring(0, sel.start)
        subStr2 = val.substring(sel.start, val.length + 1)
        for (let i = sel.start; i >= 0; i--) {
          const index = i
          let len = 0
          if (subStr.charAt(i) === '{') {
            len = sel.start - index
            const tagText = subStr.slice(index + 1, sel.start - 1)
            const tempArr = subStr.split('')
            tempArr.splice(index, len)
            result = tempArr.join('').concat(subStr2)
            const templateTagTem = Array.from(templateTag)
            templateTagTem.map((tagItem) => {
              if (tagItem.labelName === tagText) {
                const temObj = Object.assign(tagItem)
                temObj.checkedCount--
                tagItem = temObj
              }
              return tagItem
            })
            templateTagCallback(templateTagTem)
            this.setState({ pushText: result }, () => {
              this.setCursorPosition(target, sel.start - len)
            })
            onChange(result)
            evt.preventDefault()
            return
          }
        }
      }
    }
  }
  onClickHandler = (evt) => {
    evt = evt || window.event
    const { target } = evt
    const index = this.getPosition(target)
    const val = target.value
    for (let i = index - 1; i >= 0; i--) {
      if (val.charAt(i) === '}' || val.charAt(i) === '{') {
        if (val.charAt(i) === '{') {
          for (let ii = index; ii < val.length; ii++) {
            if (val.charAt(ii) === '}') {
              this.setCursorPosition(target, ii + 1)
              return
            }
          }
        }
        if (val.charAt(i) === '}') {
          evt.preventDefault()
          return
        }
      }
    }
    evt.preventDefault()
  }
  onPasteHandler = (e) => {
    const { target } = e
    if (!(e.clipboardData && e.clipboardData.items)) {
      return
    }

    for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
      const item = e.clipboardData.items[i]

      if (item.kind === 'string') {
        item.getAsString((str) => {
          if (str.match(/[{}]/ig)) {
            message.error('粘贴数据不能包含标签关键字符{或}')
            const { pushText } = this.state
            const sel = this.getInputSelection(target)
            const pushTextArr = Array.from(pushText)
            pushTextArr.splice(sel.end - str.length, str.length)
            this.setState({ pushText: pushTextArr.join('') })
            e.preventDefault()
          }
        })
      }
    }
  }
  // 设置光标位置
  setCaretPosition =(ctrl, pos) => {
    if (ctrl.setSelectionRange) {
      ctrl.focus()
      ctrl.setSelectionRange(pos, pos)
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange()
      range.collapse(true)
      range.moveEnd('character', pos)
      range.moveStart('character', pos)
      range.select()
    }
  }
  setCursorPosition =(ctrl, pos) => {
    if (ctrl.setSelectionRange) {
      ctrl.focus()

      ctrl.setSelectionRange(pos, pos)
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange()

      range.collapse(true)

      range.moveEnd('character', pos)

      range.moveStart('character', pos)

      range.select()
    }
  }
  getInputSelection = (input) => {
    let start = 0
    let end = 0
    if (!input) { return { start: 0, end: 0, length: 0 } }
    input.focus()
    if (typeof input.selectionStart === 'number' &&
            typeof input.selectionEnd === 'number') {
      start = input.selectionStart
      end = input.selectionEnd
    } else if (document.selection && document.selection.createRange) {
      const range = document.selection.createRange()
      if (range) {
        const inputRange = input.createTextRange()
        const workingRange = inputRange.duplicate()
        const bookmark = range.getBookmark()
        inputRange.moveToBookmark(bookmark)
        workingRange.setEndPoint('EndToEnd', inputRange)
        end = workingRange.text.length
        workingRange.setEndPoint('EndToStart', inputRange)
        start = workingRange.text.length
      }
    }
    return {
      start,
      end,
      length: end - start,
    }
  }
  getPosition = (element) => {
    let cursorPos = 0
    if (document.selection) { // IE
      const selectRange = document.selection.createRange()
      selectRange.moveStart('character', -element.value.length)
      cursorPos = selectRange.text.length
    } else if (element.selectionStart || element.selectionStart === '0') {
      cursorPos = element.selectionStart
    }
    return cursorPos
  }
  caculateTemplateTag = (templateTag, value) => {
    const { onChange } = this.props
    const textarea = this.refs.pushInput
    if (textarea) {
      const textAreaRef = textarea.textAreaRef
      let { end } = this.getInputSelection(textAreaRef)

      const pushTextArr = Array.from(value)
      let flag = false
      templateTag.forEach((item) => {
        const reg = new RegExp(`{${item.labelName}}`, 'ig')
        const matchs = value.match(reg) || []
        const diff = item.checkedCount - matchs.length
        const { labelName } = item
        if (diff !== 0) {
          pushTextArr.splice(end, 0, `{${labelName}}`)
          end = (end + labelName.length + 2)
          flag = true
        }
      })
      if (flag) {
        this.setState({ pushText: pushTextArr.join('') }, () => {
          this.setCaretPosition(textAreaRef, end)
          onChange(pushTextArr.join(''))
        })
      }
    }
  }
  handleTextChange = (e) => {
    const { onChange } = this.props
    const pushText = e.target.value
    this.setState({ pushText }, () => {
      onChange(pushText)
    })
  }
  handlerBlur = (e) => {
    const { onBlur } = this.props
    onBlur(e)
  }

  render() {
    const { pushText } = this.state
    const { placeholder, disabled, pushChannel } = this.props
    // const { placeholder } = this.props
    return (
      <Input.TextArea
        style={{height:'8em'}}
        disabled={disabled}
        onChange={this.handleTextChange}
        onBlur={this.handlerBlur}
        onKeyDown={this.onKeyDownHandler}
        onMouseUp={this.onMouseUpHandler}
        onClick={this.onClickHandler}
        onPaste={this.onPasteHandler}
        value={pushText}
        ref="pushInput"
        placeholder={placeholder}
        id={`pushText${pushChannel}`}
      />
    )
  }
}
