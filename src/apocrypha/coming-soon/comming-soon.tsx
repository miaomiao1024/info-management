import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export interface ComingSoonProps {
    title: string;
    desc?: string;
    prefixCls?: string;
    className?: string;
    children?: React.ReactNode;
}

export default class ComingSoon extends React.Component<ComingSoonProps, any>{
    static defaultProps = {
      desc: '',
      prefixCls: 'fui-coming-soon',
    }
    static propTypes = {
      title: PropTypes.string.isRequired,
      desc: PropTypes.string,
    }

    isNeedInserted() {
        const { children } = this.props;
        return React.Children.count(children) === 1;
    }

    render(){
      const type = "common"
      const { title, desc, prefixCls, className } = this.props;
      const classes = classNames(prefixCls, className, {
        [`${prefixCls}-${type}`]: type,
      });

      return (
        <div className={classes}>
          <div className="header">
            <span>{title}</span>
            {
              desc && <span>{desc}</span>
            }
          </div>
          <div className="content">
            <img alt='新模块即将上线' className="animation" src="https://apocrypha.didistatic.com/static/fateapocrypha/fui/resources/img/coming-soon.png"/>
          </div>
        </div>
      )
    }
}
