class StatusController < ApplicationController
  def up
    # executes a simple DB query and if the query is successful reply "UP". For
    # use in uptime checking
    migration_version = ActiveRecord::Migrator.current_version
    if migration_version > 1000
      render html: "UP", status: :ok
    else
      render html: "DOWN", status: :ok
    end
  end
end
