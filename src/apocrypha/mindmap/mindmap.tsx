import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import * as d3 from 'd3';

export interface MindMapProps {
  title: string;
  desc?: string;
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
  option?: object;
  expandDepth?: number;
}

export default class MindMap extends React.Component<MindMapProps, any>{
  static defaultProps = {
    desc: '',
    prefixCls: 'fui-mindmap',
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string,
    option: PropTypes.object.isRequired,
    expandDepth: PropTypes.number.isRequired,
  }

  isNeedInserted() {
    const { children } = this.props;
    return React.Children.count(children) === 1;
  }

  componentDidMount() {
    const { option } = this.props
    if (option)
      this.renderMindMap(option)
  }

  componentWillReceiveProps(nextprops: any) {
    const { option } = this.props
    if (option && nextprops.option)
      if (option !== nextprops.option) {
        this.renderMindMap(nextprops.option)
      }
  }

  renderMindMap = (option: any) => {
    const {
      expandDepth,
    } = this.props

    const div = document.getElementById('mindmap-svg'),
      duration = 750
    // duration = 1500

    let width = 0,
      margin = { top: 0, right: 0, bottom: 0, left: 5 },
      x_size_max = 0,
      y_size_max = 0

    if (div && div.clientWidth) width = div.clientWidth

    //hierarchy层级布局，和tree生成器一起使用，得到绘制树所需要的节点数据和边数据
    const root = d3.hierarchy(option)

    //定义节点的初始位置
    root.x0 = 0
    root.y0 = 0
    root.treeDepth = 0

    root.descendants().forEach((d: any, i: any) => {
      d.id = i
      //取得树深度
      if (d.depth > root.treeDepth) {
        root.treeDepth = d.depth
      }
      //根据默认展开级数折叠子节点
      if (expandDepth && expandDepth > 0 && (d.depth + 1) >= expandDepth) {
        d._children = d.children
        d.children = null
      }
    })

    d3.selectAll("#mindmap-svg > svg").remove()

    const svg = d3.select("#mindmap-svg")
      .append("svg")
      .attr("width", width)
      .attr("height", 0)
      .attr("viewBox", [-margin.left, -margin.top, width, 0])

    const gLink = svg.append("g")
    const gNode = svg.append("g")

    const tree = d3.tree()

    tree.separation(function () {
      return 1
    })

    drawChart(root)

    //绘制脑图
    function drawChart(source: any) {
      console.log("============")

      tree.nodeSize([x_size_max + 10, y_size_max + 10])
      tree(root)

      const nodes = root.descendants().reverse(),
        links = root.links()

      const node = gNode.selectAll(".mindmap-node")
        .data(nodes, (d: any) => d.id)

      const nodeEnter = node.enter().append("g")
        .attr('class', 'mindmap-node')
        .attr('transform', function () {
          const x_size = source.x_size ? source.x_size : 0
          return "translate(" + source.y0 + "," + (source.x0 - x_size / 2) + ")"
        })

      //节点内容--name
      nodeEnter
        .append('text')
        .attr('id', function (d: any) {
          return d.id
        })
        .attr('class', 'mindmap-node-title')
        .attr('dy', '1.5em')
        .attr('dx', '0.5em')
        .text(function (d: any) {
          if (d.data.name)
            return d.data.name
        })
        .call(getNameSize)
        .call(appendData)


      //获取name的长宽
      function getNameSize(selection: any) {
        selection.each(function (d: any) {
          d.nameWidth = this.getBBox().width
          d.nameHeight = this.getBBox().height
        })
      }

      function appendData(selection: any) {
        selection.each(function (d: any) {
          const series = d.data.series
          if (series) {
            const data = series.data
            for (let i = 0; i < data.length; i++) {
              d3.select(this.parentNode)
                .append('text')
                .attr('class', 'mindmap-node-data')
                //字体颜色
                .attr('fill', function () {
                  const style = data[i].style
                  if (style && style.fontColor)
                    return style.fontColor
                  else if (series.style && series.style.fontColor)
                    return series.style.fontColor
                })
                .attr('dy', '4em')
                .attr('dx', function (d: any) { return d.dataWidth ? d.dataWidth + 20 : '0.5em' })
                //文字内容
                .text(function () {
                  return (data[i].value || data[i])
                })
                .call(getDataSize)
            }
          }
        })
      }

      //获取data的长宽
      function getDataSize(selection: any) {
        selection.each(function (d: any) {
          if(!d.dataWidth) d.dataWidth = 0
          if (d.dataWidth < this.getBBox().width)
            d.dataWidth = this.getBBox().width
            //dataHeight $$
          d.dataHeight = this.getBBox().height
        })
      }

      //value值 
      nodeEnter
        .append('text')
        .attr('class', 'mindmap-node-data')
        .attr('dy', '3em')
        .attr('dx', '0.5em')
        .text(function (d: any) {
          if (d.data.series)
            return d.data.series.data[0].value || d.data.series.data[0]
        })
        .call(getValueWidth)
        .call(setXsize)
        .attr('fill', function (d: any) {
          if (d.data.series) {
            const style = d.data.series.data[0].style
            if (style && style.fontColor)
              return style.fontColor
            else if (d.data.series.style && d.data.series.style.fontColor)
              return d.data.series.style.fontColor
          }
        })

      //获取value的宽度
      function getValueWidth(selection: any) {
        selection.each(function (d: any) {
          d.valueWidth = this.getBBox().width
        })
      }

      //percent值
      nodeEnter
        .append('text')
        .attr('class', 'mindmap-node-data')
        .attr('fill', function (d: any) {
          if (d.data.series) {
            const style = d.data.series.data[1].style
            if (style && style.fontColor)
              return style.fontColor
            else if (d.data.series.style && d.data.series.style.fontColor)
              return d.data.series.style.fontColor
          }
        })
        .attr('dy', '3em')
        .attr('dx', function (d: any) { return d.valueWidth + 20 })
        .text(function (d: any) {
          if (d.data.series)
            return (d.data.series.data[1].value || d.data.series.data[1]) + '%'
        })
        .call(getValuePercentWidth)
        .call(setYsize)
        .attr('next', function (d: any) {
          const series = d.data.series
          if (series && series.data[1].appendIcon) {
            const appendIcon = series.data[1].appendIcon
            d3.select(this.parentNode)
              .insert('svg')
              .attr('viewBox', '0 0 1024 1024')
              //动态icon位置 $$
              .attr('x', function (d: any) { return d.valueWidth + 10 })
              .attr('y', 28)
              //扩充icon size $$
              .attr('width', 10)
              .attr('height', 10)
              .append('path')
              .attr('d', function () {
                //扩充icon类型 $$
                switch (appendIcon.type) {
                  case 'caret-up': return 'M0 767.909l512.029-511.913L1024 767.909 0 767.909z';
                  case 'caret-down': return 'M1024 255.996 511.971 767.909 0 255.996 1024 255.996z';
                }
              })
              //icon颜色
              .attr('fill', function (d: any) {
                const series = d.data.series
                if (series && series.data && series.data[1].appendIcon) {
                  return series.data[1].appendIcon.color
                }
              })
            return true
          }
          return false
        })

      //获取name和value的宽度
      function getValuePercentWidth(selection: any) {
        selection.each(function (d: any) { d.valuePercentWidth = d.valueWidth + this.getBBox().width + 15 })
      }

      function setXsize(selection: any) {
        selection.each(function (d: any) {
          d.x_size = this.getBBox().height + d.nameHeight + 14
        })
      }

      function setYsize(selection: any) {
        selection.each(function (d: any) {
          d.y_size = ((d.nameWidth > d.valuePercentWidth) ? d.nameWidth : d.valuePercentWidth) + 20
        })
      }

      //背景方框
      nodeEnter
        .insert("rect", "text")
        .attr('rx', 5)
        .attr('ry', 5)
        //背景框宽度为背景框内容的宽度
        .attr('width', function (d: any) {
          return d.y_size
        })
        //根据数据设置景框高度
        .attr('height', function (d: any) {
          return d.x_size
        })
        .attr('fill', '#fff')
        .attr('stroke', '#ccc')
        .attr('next', function (d: any) {
          if (d.children || d._children) {
            const circle_g = d3.select(this.parentNode).append('g')
              .attr("transform", function (d: any) {
                return 'translate(' + (d.y_size - 4) + ',' + (d.x_size / 2 - 5) + ')'
              })
              .on("click", toggle)
            circle_g.append('circle')
              .attr('r', 7)
              .attr('cx', 3.5)
              .attr('cy', 3.5)
              .attr('stroke', '#ccc')
              .attr('fill', '#fff')
            circle_g.append('line')
              .attr('x1', 0)
              .attr('y1', 3.5)
              .attr('x2', 7)
              .attr('y2', 3.5)
              .attr('stroke', '#ccc')
            const circle_vertical_line = circle_g.append('line')
              .attr('x1', 3.5)
              .attr('y1', 0)
              .attr('x2', 3.5)
              .attr('y2', 7)
              .attr('stroke', '#ccc')
              .classed('vertical-line', true)
            circle_vertical_line.style('display', 'none')
            if (d._children) {
              circle_vertical_line.style('display', 'block')
            } else {
              circle_vertical_line.style('display', 'none')
            }
            return true
          }
          return false
        })

      let x_min = nodes[0].x,
        x_max = nodes[0].x,
        maxDepthSize: any[] = []

      x_size_max = nodes[0].x_size
      y_size_max = nodes[0].y_size

      nodes.forEach(function (n: any) {
        x_size_max = Math.max(x_size_max, n.x_size)
        y_size_max = Math.max(y_size_max, n.y_size)
        if (!maxDepthSize[n.depth] || n.y_size > maxDepthSize[n.depth]) maxDepthSize[n.depth] = n.y_size
      })

      tree.nodeSize([x_size_max + 10, y_size_max + 10])
      tree(root)

      nodes.forEach(function (n: any) {
        x_min = Math.min(x_min, n.x)
        x_max = Math.max(x_max, n.x)
      })

      margin = { top: (x_size_max / 2) + 5, right: 0, bottom: x_size_max / 2 + 5, left: 5 }
      const height = x_max - x_min + margin.top + margin.bottom

      const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-margin.left, x_min - margin.top, width, height])

      //节点的 Update 部分的处理办法，展开动画
      node.merge(nodeEnter).transition(transition)
        .attr("transform", function (d: any) {
          let sum = 0
          if (d.depth === 0) d.y = 0
          else {
            for (let i = 0; i < maxDepthSize.length; i++) {
              sum += maxDepthSize[i]
            }
            let temp = 0
            for (let i = 0; i < d.depth; i++) {
              if (width - sum > 0)
                temp = temp + maxDepthSize[i] + (width - sum - 10) / root.treeDepth
              else
                temp = temp + maxDepthSize[i] + 15
            }
            d.y = temp
          }
          return "translate(" + d.y + ","
            + (d.x - d.x_size / 2) + ")"
        })

      //3. 节点的 Exit 部分的处理办法
      node.exit()
        .transition(transition)
        .remove()
        .attr("transform", function () {
          return "translate(" + (source.y + source.y_size) + ","
            + (source.x - source.x_size / 2) + ")"
        })

      //连线
      //获取连线的update部分
      const link = gLink.selectAll(".mindmap-link")
        .data(links, (d: any) => d.target.id)

      const diagonal = d3.linkHorizontal()
        .source(function (d: any) {
          var s = d.source;
          return {
            x: s.x,
            y: s.y + s.y_size
          };
        })
        .x((d: any) => d.y).y((d: any) => d.x)

      const exit_diagonal = d3.linkHorizontal()
        .source(function (d: any) {
          var s = d.source;
          return {
            x: s.x,
            y: s.y
          };
        })
        .x((d: any) => d.y).y((d: any) => d.x)

      const linkEnter = link.enter().append("path")
        .attr("class", "mindmap-link")
        .attr("d", () => {
          const o = {
            x: source.x0,
            y: source.y0,
            y_size: source.y_size
          }
          return diagonal({ source: o, target: o });
        })

      link.merge(linkEnter).transition(transition)
        .attr("d", diagonal)

      link.exit().transition(transition)
        .remove()
        .attr("d", () => {
          const o = {
            x: source.x,
            y: source.y + source.y_size,
            y_size: source.y_size
          }
          return exit_diagonal({ source: o, target: o })
        })

      root.eachBefore((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      })
    }
    function toggle(d: any) {
      if (d.children) {
        d3.select(this).select('.vertical-line').style('display', 'block')
        d._children = d.children
        d.children = null
      }
      else {
        d3.select(this).select('.vertical-line').style('display', 'none')
        d.children = d._children
        d._children = null
      }
      drawChart(d)
    }
  }

  render() {
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
        <div className="content" id="mindmap-svg">
        </div>
      </div>
    )
  }
}
