export function filterQuestionFunc(query: string = "") {
  return (q: T_Question) => {
    const { content, options, answers, group, type } = q;

    const con = content?.toLowerCase() ?? "";
    const opt = options?.join(" | ").toLowerCase() ?? "";
    const ans = (answers ?? [])
      .map((a) => options.find((o) => o.id === a)?.text)
      .join(", ")
      .toLowerCase();

    console.log(ans);
    const grp = group?.toLowerCase() ?? "";
    const tpt = type?.toLowerCase() ?? "";
    const qq = query.toLowerCase();

    return [con, opt, ans, grp, tpt].join(" ").includes(qq);
  };
}
