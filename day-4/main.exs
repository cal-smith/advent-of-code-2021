defmodule Bingo do
  def main(body) do
    all_lines = String.split(body, "\n")
    [draws_string | lines] = all_lines
    draws = String.split(draws_string, ",") |> Enum.map(fn v -> String.to_integer(v) end)
    boards = parse_boards(tl(lines))
    results = play(boards, draws)
    winning_results = Enum.filter(results, fn {_draw, boards} -> !Enum.empty?(boards) end)
    winning_sums = Enum.map(winning_results, fn {draw, boards} ->
      {draw, Enum.map(boards, fn board ->
        sum_board(board)
      end)}
    end)
    # IO.inspect(winning_sums)
    {first_draw, first_sums} = Enum.at(winning_sums, 0)
    {last_draw, last_sums} = Enum.at(winning_sums, Enum.count(winning_sums) - 1)
    IO.puts("part 1: #{first_draw * Enum.at(first_sums, 0)}")
    IO.puts("part 2: #{last_draw * Enum.at(last_sums, 0)}")
  end

  def sum_board(board) do
    Enum.reduce(board, 0, fn row, row_acc ->
      row_acc + Enum.reduce(row, 0, fn {value, selected}, cell_acc ->
        if !selected do
          value + cell_acc
        else
          cell_acc
        end
      end)
    end)
  end

  def play(boards, [draw | draws]) do
    game_results = play_draw(boards, draw)
    new_boards = Enum.filter(game_results, fn board -> !winning_board?(board) end)
    winning_state = {draw, Enum.filter(game_results, fn board -> winning_board?(board) end)}
    [winning_state | play(new_boards, draws)]
  end

  def play(_boards, []) do
    []
  end

  def winning_board?(board) do
    row_win = Enum.any?(board, fn row ->
      Enum.all?(row, fn {_value, selected} -> selected end)
    end)
    col_win = Enum.any?(0..length(Enum.at(board, 0)) - 1, fn col_index ->
      Enum.all?(board, fn row ->
        elem(Enum.at(row, col_index), 1)
      end)
    end)
    row_win or col_win
  end

  def play_draw(boards, draw) do
    Enum.map(boards, fn board ->
      update_board(board, draw)
    end)
  end

  def update_board(board, draw) do
    Enum.map(board, fn row ->
      Enum.map(row, fn {value, selected} ->
        if value == draw do
          {value, true}
        else
          {value, selected}
        end
      end)
    end)
  end

  def parse_boards(lines) do
    chunk_fn = fn element, acc ->
      if Enum.empty?(element) do
        {:cont, acc, []}
      else
        {:cont, [element | acc]}
      end
    end
    after_fn = fn
      [] -> {:cont, []}
      acc -> {:cont, acc, []}
    end
    Enum.map(lines, fn line ->
      String.split(line, ~r{\s+})
      |> Enum.filter(fn element -> element != ""  end)
      |> Enum.map(fn element -> {String.to_integer(element), false} end)
    end) |> Enum.chunk_while([], chunk_fn, after_fn)
    |> Enum.map(fn r -> Enum.reverse(r) end)
  end
end

case File.read("./input.txt") do
  {:ok, body} -> Bingo.main(body)
  {:error, reason} -> IO.puts(reason)
end
