export const jsxJoin = (list: JSX.Element[], separator: JSX.Element): JSX.Element => {
  const result: JSX.Element[] = []
  for (let i = 0; i < list.length; i++) {
    result.push(list[i])
    if (i < list.length - 1) {
      result.push(separator)
    }
  }
  return <>{result}</>
}
