class HelpSectionSerializer
  include FastJsonapi::ObjectSerializer

  belongs_to :help_topic
  
  attributes :section_title,
    :section_body
end
