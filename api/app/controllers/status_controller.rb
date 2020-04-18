class StatusController < ApplicationController
  def up
    # executes a simple DB query and if the query is successful reply "UP". For
    # use in uptime checking
    migration = ActiveRecord::Migrator.current_version
    if migration > 1000
      render html: "UP", status: :ok
    else
      render html: "DOWN", status: :ok
    end
  end
end
