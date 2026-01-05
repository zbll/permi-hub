import { useState } from "react";
import { useLocation } from "react-router";

/**
 * 表格定义相关的自定义Hook
 * 用于管理表格的分页状态和视图显示状态
 *
 * 该Hook会从URL参数中获取当前页码(index)，并用作分页的初始值
 * 提供当前页码、总页数和视图显示状态的管理
 */
export function useDefineTable() {
  // 获取当前路由的URL参数
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  // 从URL参数中获取index值
  const index = search.get("index");

  // 解析URL中的页码参数，如果参数不存在或小于1，则默认为1
  const defaultCur = index === null ? 1 : Number(index) < 1 ? 1 : Number(index);

  // 当前页码状态，初始化为URL参数中的页码或默认值1
  const [cur, setCur] = useState(defaultCur);

  // 总页数状态，初始值为0
  const [total, setTotal] = useState(0);

  // 每页显示的项目数状态，初始值为10
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 视图显示状态，控制某些视图元素的显示/隐藏
  const [showView, setShowView] = useState(false);

  return {
    cur, // 当前页码
    setCur, // 设置当前页码的函数
    total, // 总页数
    setTotal, // 设置总页数的函数
    rowsPerPage, // 每页显示的项目数
    setRowsPerPage, // 设置每页显示的项目数的函数
    showView, // 视图显示状态
    setShowView, // 设置视图显示状态的函数
  };
}
