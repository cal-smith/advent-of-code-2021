# frozen_string_literal: true

commands = File.readlines('input.txt').map do |line|
  command, value_str = line.split(' ')

  [command, value_str.to_i]
end

depth = 0
horizontal = 0
commands.each do |command, value|
  case command
  when 'up'
    depth -= value
  when 'down'
    depth += value
  when 'forward'
    horizontal += value
  end
end

puts "part1: #{depth * horizontal}"
