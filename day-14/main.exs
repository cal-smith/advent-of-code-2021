defmodule Polymer do
  def count_polys(content, steps) do
    {poly, commands} = parse(content)
    {{_minKey, min}, {_maxKey, max}} = count_letters(poly, commands, steps)
    |> min_max()
    max - min
  end

  def count_polys_slow(content, steps) do
    {poly, commands} = parse(content)
    {{_minKey, min}, {_maxKey, max}} = step(poly, commands, steps)
    |> count_elements()
    |> min_max()
    max - min
  end

  def min_max(counts) do
    Enum.min_max_by(counts, fn {_k, v} -> v end)
  end

  def count_elements(polymer) do
    Enum.group_by(polymer, fn (e) -> e end)
    |> Enum.map(fn {k, v} -> {k, Enum.count(v)} end)
  end

  def step_pairs(freq, _commands, 0), do: freq
  def step_pairs(freq, commands, steps) do
    m = %{}
    new_freq = Enum.map(freq, fn {key, count} ->
      [a, b] = key
      [x] = commands[key]
      %{
        [a, x] => count,
        [x, b] => count
      }
    end)
    |> Enum.reduce(m, fn m, acc ->
      Map.merge(acc, m, &Polymer.resolve_letter_merge/3)
    end)
    step_pairs(new_freq, commands, steps - 1)
  end

  def count_letters(polymer, commands, steps) do
    freq = Enum.frequencies(Enum.chunk_every(polymer, 2, 1, :discard))
    step_pairs(freq, commands, steps)
    |> Enum.group_by(fn {[a, _b], _value} -> a end, fn {_key, value} -> value end)
    |> Enum.map(fn {k, v} ->
      sum = if [k] == Enum.take(polymer, -1) do
        Enum.sum(v) + 1
      else
        Enum.sum(v)
      end
      {k, sum}
    end)
  end

  def resolve_letter_merge(_key, value1, value2) do
    value1 + value2
  end

  def step(polymer, commands, steps) do
    case steps do
      # special case for 0 - just return the polymer
      0 -> polymer
      # if we're on the first step, just return the expansion result
      1 -> expand(polymer, commands)
      # otherwise expand and decrement step by 1
      _ -> expand(polymer, commands) |> step(commands, steps - 1)
    end
  end

  def expand([last_poly], _commands), do: [last_poly]
  def expand(polymer, commands) do
    pair = Enum.take(polymer, 2)
    # poly_pair = Enum.join(pair)
    case commands[pair] do
      [x] -> [hd(polymer) | [ x | expand(tl(polymer), commands)]]
      _ -> [hd(polymer) | expand(tl(polymer), commands)]
    end
  end

  def parse(input) do
    [raw_polymer, raw_commands] = String.split(input, "\n\n")
    polymer = String.split(raw_polymer, "", trim: true)
    commands = String.split(raw_commands, "\n", trim: true)
    |> Enum.map(fn line ->
      [command, value] = String.split(line, " -> ", trim: true)
      [String.split(command, "", trim: true), value]
    end)
    |> Enum.group_by(fn [k, _v] -> k end, fn [_k, v] -> v end)
    {polymer, commands}
  end
end

example = """
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
"""

IO.puts("Example:")
IO.puts("part 1: #{Polymer.count_polys(example, 10)}")
IO.puts("part 1 (slow): #{Polymer.count_polys_slow(example, 10)}")

IO.puts("\nReal:")
case File.read("./input.txt") do
  {:ok, body} ->
    IO.puts("part 1: #{Polymer.count_polys(body, 10)}")
    IO.puts("part 2: #{Polymer.count_polys(body, 40)}")
  {:error, reason} -> IO.puts(reason)
end
