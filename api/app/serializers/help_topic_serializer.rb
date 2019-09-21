class HelpTopicSerializer
  include FastJsonapi::ObjectSerializer

  has_many :help_sections

  attributes :short_title,
             :title,
             :all_users,
             :contractors_only,
             :broadcasters_only,
             :developers_only,
             :help_sections
end
