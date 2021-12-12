defmodule SyntaxChecker do
  def main(body) do
    lines = parse(body)
    score = Enum.reduce(lines, 0, fn line, acc ->
      acc + has_errors(line)
    end)
    IO.puts("part 1: #{score}")

    incomplete_lines = Enum.filter(lines, fn line -> has_errors(line) == 0 end)
    scores = Enum.map(incomplete_lines, fn line ->
      complete(line) |> Enum.reduce(0, fn elem, acc ->
        (acc * 5) + elem.value
      end)
    end)

    complete_score = scores
    |> Enum.sort()
    |> Enum.at(floor(Enum.count(scores) / 2))
    IO.puts("part 2: #{complete_score}")
  end

  def complete(line), do: complete(tl(line), [hd(line)])
  def complete([], stack) do
    Enum.map(stack, fn paren ->
      case paren do
        "(" -> %{ :paren => ")", :value => 1}
        "[" -> %{ :paren => "]", :value => 2}
        "{" -> %{ :paren => "}", :value => 3}
        "<" -> %{ :paren => ">", :value => 4}
      end
    end)
  end
  def complete(line, []), do: complete(line)
  def complete([paren | line], stack) do
    if paren in ["(", "[", "{", "<"] do
      complete(line, [paren | stack])
    else
      cond do
        hd(stack) == "(" and paren != ")" -> complete(line, stack)
        hd(stack) == "[" and paren != "]" -> complete(line, stack)
        hd(stack) == "{" and paren != "}" -> complete(line, stack)
        hd(stack) == "<" and paren != ">" -> complete(line, stack)
        true -> complete(line, tl(stack))
      end
    end
  end

  def has_errors(line), do: has_errors(tl(line), [hd(line)])
  def has_errors([], _stack), do: 0
  def has_errors([_paren | line], []),  do: has_errors(line, [])
  def has_errors([paren | line], stack) do
    if paren in ["(", "[", "{", "<"] do
      has_errors(line, [paren | stack])
    else
      cond do
        hd(stack) != "(" and paren == ")" -> 3
        hd(stack) != "[" and paren == "]" -> 57
        hd(stack) != "{" and paren == "}" -> 1197
        hd(stack) != "<" and paren == ">" -> 25137
        true -> has_errors(line, tl(stack))
      end
    end
  end

  def parse(input) do
    all_lines = String.split(input, "\n", trim: true)
    Enum.map(all_lines, fn line ->
      String.split(line, "", trim: true)
    end)
  end
end

example = """
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
"""

IO.puts("Example:")
SyntaxChecker.main(example)

IO.puts("\nReal:")
case File.read("./input.txt") do
  {:ok, body} -> SyntaxChecker.main(body)
  {:error, reason} -> IO.puts(reason)
end
