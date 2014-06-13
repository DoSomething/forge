require 'sinatra'
require 'kss'
require 'json'

set :public_folder, Proc.new { File.join(root) }
set :views, Proc.new { File.join(root, "styleguide") }



get '/' do
  @package = JSON.parse( File.read('package.json') )
  @version = "v#{@package["version"]}"

  @styleguide = Kss::Parser.new('scss/')
  erb :styleguide
end

helpers do
  # Generates a styleguide block. A little bit evil with @_out_buf, but
  # if you're using something like Rails, you can write a much cleaner helper
  # very easily.
  def styleguide_block(section, &block)
    @section = @styleguide.section(section)
    @example_html = capture{ block.call }
    @escaped_html = ERB::Util.html_escape @example_html
    @_out_buf << erb(:_styleguide_block)
  end

  def styleguide_block_without_preview(section, &block)
    @section = @styleguide.section(section)
    @example_html = capture{ block.call }
    @escaped_html = ERB::Util.html_escape @example_html
    @_out_buf << erb(:_styleguide_block_without_preview)
  end

  def styleguide_block_without_modifiers(section, &block)
    @section = @styleguide.section(section)
    @example_html = capture{ block.call }
    @escaped_html = ERB::Util.html_escape @example_html
    @_out_buf << erb(:_styleguide_block_without_modifiers)
  end

  def styleguide_block_custom_example(section)
    @section = @styleguide.section(section)
    @_out_buf << erb(:_styleguide_block_custom_example)
  end

  # Captures the result of a block within an erb template without spitting it
  # to the output buffer.
  def capture(&block)
    out, @_out_buf = @_out_buf, ""
    yield
    @_out_buf
  ensure
    @_out_buf = out
  end
end

