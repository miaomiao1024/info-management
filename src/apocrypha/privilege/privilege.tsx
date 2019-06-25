import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export interface PrivilegeProps {
    title: string;
    desc?: string;
    url: string;
    prefixCls?: string;
    className?: string;
    children?: React.ReactNode;
}

export default class Privilege extends React.Component<PrivilegeProps, any>{
    static defaultProps = {
      desc: '',
      prefixCls: 'fui-privilege',
    }
    static propTypes = {
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      desc: PropTypes.string,
    }

    isNeedInserted() {
        const { children } = this.props;
        return React.Children.count(children) === 1;
    }

    render(){
      const type = "default"
      const { title, desc, prefixCls, className, url } = this.props;
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
            <a
              className="link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              UPM权限申请
            </a>
          </div>
          <div className="content">
          <img
            src="http://apocrypha.didistatic.com/static/fateapocrypha/assets/img/privilege.png"
            alt="暂无权限访问" />
          </div>
        </div>
      )
    }
}
